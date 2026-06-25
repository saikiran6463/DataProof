package com.dataproof.request;

import com.dataproof.llm.LlmClient;
import com.dataproof.model.Request;
import com.dataproof.model.RequestStatus;
import com.dataproof.repository.RequestRepository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VerificationService {

    private static final Logger log = LoggerFactory.getLogger(VerificationService.class);

    private final RequestRepository requestRepository;
    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;
    private final RequestService requestService;

    public VerificationService(RequestRepository requestRepository,
                                LlmClient llmClient,
                                ObjectMapper objectMapper,
                                RequestService requestService) {
        this.requestRepository = requestRepository;
        this.llmClient = llmClient;
        this.objectMapper = objectMapper;
        this.requestService = requestService;
    }

    public Map<String, Object> verify(String requestId, String replyText) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        List<Map<String, String>> obligations = requestService.getObligationsForRequest(request);

        String prompt = buildVerifyPrompt(obligations, replyText);
        Map<String, Object> parsed = callWithRetry(prompt);

        List<Map<String, Object>> checks = enrichWithCitations(
                (List<Map<String, Object>>) parsed.get("checks"), obligations);

        int completeness = computeCompleteness(checks);
        String verdict = completeness >= 80 ? "complete" : "incomplete";
        String summary = (String) parsed.get("summary");
        String recommendedNextStep = (String) parsed.get("recommendedNextStep");

        request.setStatus(RequestStatus.VERIFIED);
        request.setCompleteness(completeness);
        request.setVerdict(verdict);
        request.setSummary(summary);
        request.setRecommendedNextStep(recommendedNextStep);
        try {
            request.setChecksJson(objectMapper.writeValueAsString(checks));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize checks", e);
        }
        requestRepository.save(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("requestId", requestId);
        response.put("completeness", completeness);
        response.put("verdict", verdict);
        response.put("summary", summary);
        response.put("checks", checks);
        response.put("recommendedNextStep", recommendedNextStep);
        return response;
    }

    private Map<String, Object> callWithRetry(String prompt) {
        String llmResponse = llmClient.complete(prompt);
        try {
            return parseLlmResponse(llmResponse);
        } catch (Exception e) {
            log.warn("First LLM parse attempt failed, retrying once");
            llmResponse = llmClient.complete(prompt);
            return parseLlmResponse(llmResponse);
        }
    }

    private String buildVerifyPrompt(List<Map<String, String>> obligations, String replyText) {
        StringBuilder obligationList = new StringBuilder();
        for (int i = 0; i < obligations.size(); i++) {
            Map<String, String> o = obligations.get(i);
            String line = (i + 1) + ". [id: " + o.get("id") + "] " + o.get("label");
            if (o.containsKey("citation")) {
                line += " (" + o.get("citation") + ")";
            }
            obligationList.append(line).append("\n");
        }

        return """
                You are a GDPR compliance checker. Evaluate whether the company reply below \
                adequately addresses each data access obligation under GDPR Article 15.

                OBLIGATIONS TO CHECK:
                """ + obligationList + """

                COMPANY REPLY:
                """ + replyText + """

                For each obligation, assign a status:
                - "provided": the reply clearly and fully addresses this item
                - "unclear": the reply partially or vaguely addresses this item
                - "missing": the reply does not address this item at all

                Respond with ONLY valid JSON — no markdown, no explanation outside the JSON:
                {
                  "checks": [
                    {"id": "profile",    "obligation": "Account & profile data",              "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "activity",   "obligation": "Workout & activity history",           "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "billing",    "obligation": "Payment & billing records",            "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "health",     "obligation": "Health metrics (heart rate, weight)",  "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "location",   "obligation": "Location / GPS history",               "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "recipients", "obligation": "Who your data was shared with",        "status": "provided|unclear|missing", "note": "one sentence"},
                    {"id": "retention",  "obligation": "How long they keep your data",         "status": "provided|unclear|missing", "note": "one sentence"}
                  ],
                  "summary": "X provided, Y unclear, Z missing",
                  "recommendedNextStep": "specific follow-up citing relevant GDPR articles for missing items"
                }
                """;
    }

    private Map<String, Object> parseLlmResponse(String response) {
        String cleaned = response.strip();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("(?s)^```[a-z]*\\n?", "").replaceAll("```$", "").strip();
        }
        try {
            return objectMapper.readValue(cleaned, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to parse LLM verification response: {}", response);
            throw new RuntimeException("Failed to parse LLM response", e);
        }
    }

    private List<Map<String, Object>> enrichWithCitations(
            List<Map<String, Object>> checks, List<Map<String, String>> obligations) {
        Map<String, String> citationById = obligations.stream()
                .filter(o -> o.containsKey("citation"))
                .collect(Collectors.toMap(o -> o.get("id"), o -> o.get("citation")));

        return checks.stream().map(check -> {
            Map<String, Object> enriched = new LinkedHashMap<>(check);
            String id = (String) check.get("id");
            String status = (String) check.get("status");
            if (citationById.containsKey(id) && !"provided".equals(status)) {
                enriched.put("citation", citationById.get(id));
            }
            return enriched;
        }).collect(Collectors.toList());
    }

    private int computeCompleteness(List<Map<String, Object>> checks) {
        double total = checks.stream().mapToDouble(check -> switch ((String) check.get("status")) {
            case "provided" -> 1.0;
            case "unclear"  -> 0.5;
            default         -> 0.0;
        }).sum();
        return (int) Math.round((total / checks.size()) * 100);
    }
}
