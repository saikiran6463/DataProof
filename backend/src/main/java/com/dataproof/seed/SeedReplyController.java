package com.dataproof.seed;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seed")
public class SeedReplyController {

    @GetMapping("/replies")
    public List<Map<String, String>> listReplies() {
        return List.of(
                Map.of("id", "reply_incomplete", "label", "FitPulse reply (typical)"),
                Map.of("id", "reply_complete",   "label", "FitPulse reply (fully compliant)")
        );
    }
}
