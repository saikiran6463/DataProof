package com.dataproof.request;

import com.dataproof.llm.LlmClient;
import com.dataproof.model.Request;
import com.dataproof.model.RequestStatus;
import com.dataproof.repository.RequestRepository;
import com.dataproof.rules.RulesLoader;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final RulesLoader rulesLoader;
    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;

    public RequestService(RequestRepository requestRepository,
                          RulesLoader rulesLoader,
                          LlmClient llmClient,
                          ObjectMapper objectMapper) {
        this.requestRepository = requestRepository;
        this.rulesLoader = rulesLoader;
        this.llmClient = llmClient;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> createRequest(CreateRequestBody body) {
        String law = pickLaw(body.getJurisdiction());
        List<Map<String, String>> obligations = rulesLoader.loadGdprAccessObligations();

        String draft = llmClient.complete(buildDraftPrompt(body, obligations));

        Request request = new Request();
        request.setCompany(body.getCompany());
        request.setGoal(body.getGoal());
        request.setJurisdiction(body.getJurisdiction());
        request.setLaw(law);
        request.setContact("privacy@fitpulse.example");
        request.setDeadlineDays(30);
        request.setStatus(RequestStatus.DRAFT);
        request.setDraftRequest(draft);

        try {
            request.setObligations(objectMapper.writeValueAsString(obligations));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize obligations", e);
        }

        requestRepository.save(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("requestId", request.getId());
        response.put("law", law);
        response.put("contact", request.getContact());
        response.put("deadlineDays", 30);
        response.put("status", "draft");
        response.put("obligations", obligations);
        response.put("draftRequest", draft);
        return response;
    }

    public Map<String, Object> sendRequest(String id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        request.setStatus(RequestStatus.SENT);
        request.setSentAt(Instant.now());
        request.setDueBy(LocalDate.now().plusDays(30));
        requestRepository.save(request);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("requestId", request.getId());
        response.put("status", "sent");
        response.put("sentAt", request.getSentAt().toString());
        response.put("dueBy", request.getDueBy().toString());
        return response;
    }

    public List<Map<String, String>> getObligationsForRequest(Request request) {
        try {
            return objectMapper.readValue(request.getObligations(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize obligations", e);
        }
    }

    private String pickLaw(String jurisdiction) {
        return "EU".equalsIgnoreCase(jurisdiction) ? "GDPR" : "GDPR";
    }

    private String buildDraftPrompt(CreateRequestBody body, List<Map<String, String>> obligations) {
        String obligationList = obligations.stream()
                .map(o -> "- " + o.get("label"))
                .collect(Collectors.joining("\n"));

        return String.format("""
                Write a formal GDPR Article 15 data access request email to %s.
                Send it to: privacy@fitpulse.example

                Request the following data specifically:
                %s

                Rules:
                - Start with "Dear %s Privacy Team,"
                - Cite GDPR Article 15 clearly
                - Mention the 30-day response deadline
                - Sign off as "A concerned user"
                - Return only the email body, no subject line
                """,
                body.getCompany(), obligationList, body.getCompany());
    }
}
