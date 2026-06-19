package com.dataproof.llm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.ContentBlock;
import software.amazon.awssdk.services.bedrockruntime.model.ConversationRole;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseRequest;
import software.amazon.awssdk.services.bedrockruntime.model.ConverseResponse;
import software.amazon.awssdk.services.bedrockruntime.model.Message;

/** Calls AWS Bedrock Converse API; auth comes from the standard AWS credential chain. */
@Component
public class BedrockLlmClient implements LlmClient {

    private static final Logger log = LoggerFactory.getLogger(BedrockLlmClient.class);

    private final BedrockRuntimeClient bedrockClient;
    private final String modelId;

    public BedrockLlmClient(@Value("${bedrock.model-id}") String modelId,
                             @Value("${bedrock.region}") String region) {
        this.modelId = modelId;
        this.bedrockClient = BedrockRuntimeClient.builder()
                .region(Region.of(region))
                .build();
    }

    @Override
    public String complete(String prompt) {
        ConverseRequest request = ConverseRequest.builder()
                .modelId(modelId)
                .messages(Message.builder()
                        .role(ConversationRole.USER)
                        .content(ContentBlock.fromText(prompt))
                        .build())
                .build();

        ConverseResponse response = bedrockClient.converse(request);
        String result = response.output().message().content().get(0).text();
        log.info("Bedrock response received, length={}", result.length());
        return result;
    }
}
