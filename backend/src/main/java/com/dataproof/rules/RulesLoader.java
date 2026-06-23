package com.dataproof.rules;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/** Loads obligation sets from JSON resource files. */
@Component
public class RulesLoader {

    private static final Logger log = LoggerFactory.getLogger(RulesLoader.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Map<String, String>> loadGdprAccessObligations() {
        try {
            var resource = new ClassPathResource("rules/gdpr-access.json");
            List<Map<String, String>> obligations = objectMapper.readValue(
                    resource.getInputStream(),
                    new TypeReference<>() {}
            );
            log.info("Loaded {} GDPR access obligations", obligations.size());
            return obligations;
        } catch (IOException e) {
            log.error("Failed to load GDPR access obligations", e);
            throw new RuntimeException("Could not load rules base", e);
        }
    }
}
