package com.dataproof.seed;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/** Loads pre-seeded FitPulse reply texts from resource files. */
@Component
public class SeedReplyLoader {

    public String loadReply(String replyId) {
        String path = "replies/" + replyId + ".txt";
        try {
            var resource = new ClassPathResource(path);
            return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Seeded reply not found: " + replyId, e);
        }
    }
}
