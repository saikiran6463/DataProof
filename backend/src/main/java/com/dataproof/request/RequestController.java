package com.dataproof.request;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;
    private final VerificationService verificationService;

    public RequestController(RequestService requestService,
                             VerificationService verificationService) {
        this.requestService = requestService;
        this.verificationService = verificationService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody CreateRequestBody body) {
        return ResponseEntity.ok(requestService.createRequest(body));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Map<String, Object>> send(@PathVariable String id) {
        return ResponseEntity.ok(requestService.sendRequest(id));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> verify(@PathVariable String id,
                                                      @RequestParam("file") MultipartFile file) {
        try {
            String replyText = new String(file.getBytes(), StandardCharsets.UTF_8);
            return ResponseEntity.ok(verificationService.verify(id, replyText));
        } catch (Exception e) {
            throw new RuntimeException("Failed to read uploaded file", e);
        }
    }
}
