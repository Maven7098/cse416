package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProposedCompareService {

    private static final String[] RACES = {"Asian", "Black", "Hispanic", "White"};

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CompareDataRepository compareDataRepository;

    public ProposedCompareService(CompareDataRepository compareDataRepository) {
        this.compareDataRepository = compareDataRepository;
    }

    // Returns:
    // [0] VRA Impact Threshold Table (GUI-20): race-keyed {Black, Hispanic, Asian, White}
    // [1] Compare-Box charts (GUI-21): race-keyed uppercase {ASIAN, BLACK, HISPANIC, WHITE} mpld3 objects
    // [2] Compare Histogram (GUI-22): race-keyed uppercase {ASIAN, BLACK, HISPANIC, WHITE} mpld3 objects
    public ArrayNode getHomePayload(String currentState, String count, String threshold)
            throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (!currentState.equals("ia") && !currentState.equals("ga")) return response;

        String variantKey = count + "_" + threshold;

        CompareDataDocument compareDoc = compareDataRepository.findByCurrentState(currentState)
            .orElseThrow(() -> new IOException(
                "Missing compare_data for " + currentState));

        org.bson.Document variant = (org.bson.Document) compareDoc.getPayload().get(variantKey);
        JsonNode thresholdNode = objectMapper.readTree(((org.bson.Document) variant.get("compareThreshold")).toJson());

        response.add(thresholdNode);
        response.add(buildUppercaseRaceKeyedNode((org.bson.Document) variant.get("compareBox")));
        response.add(buildUppercaseRaceKeyedNode((org.bson.Document) variant.get("compareHistogram")));

        return response;
    }

    // Remaps title-case keys (Asian, Black, Hispanic, White) to uppercase (ASIAN, BLACK, HISPANIC, WHITE)
    private ObjectNode buildUppercaseRaceKeyedNode(org.bson.Document doc) throws IOException {
        ObjectNode node = objectMapper.createObjectNode();
        for (String race : RACES) {
            node.set(race.toUpperCase(),
                objectMapper.readTree(((org.bson.Document) doc.get(race)).toJson()));
        }
        return node;
    }
}
