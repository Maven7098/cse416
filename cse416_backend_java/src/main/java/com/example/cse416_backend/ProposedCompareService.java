package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProposedCompareService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProposedCompareService() {}

    // Returns:
    // [0] Compare-Box charts (GUI-21): minority effectiveness box plots, one per race
    // [1] Compare-Histogram charts (GUI-22): minority effectiveness histograms, one per race
    // [2] VRA Impact Threshold Table (GUI-20): placeholder until Compare-Threshold.json is generated
    public ArrayNode getHomePayload(String currentState, String count, String threshold)
            throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (!currentState.equals("ia") && !currentState.equals("ga")) return response;

        String folder = "Complete_" + count + "_" + threshold;
        String prefix = "assets/" + currentState + "/" + folder
                      + "/NEW-" + currentState.toUpperCase() + "-Precinct-";

        // [0] Compare-Box: one mpld3 chart object per race, tagged with race key
        ArrayNode compareBox = objectMapper.createArrayNode();
        for (String race : new String[]{"Asian", "Black", "Hispanic"}) {
            JsonNode node = loadJsonNode(prefix + race + "-Compare-Box.json");
            if (node.isObject()) {
                ObjectNode tagged = ((ObjectNode) node).deepCopy();
                tagged.put("race", race.toUpperCase());
                compareBox.add(tagged);
            }
        }
        response.add(compareBox);

        // [1] Compare-Histogram: one mpld3 chart object per race, tagged with race key
        ArrayNode compareHist = objectMapper.createArrayNode();
        for (String race : new String[]{"Asian", "Black", "Hispanic"}) {
            JsonNode node = loadJsonNode(prefix + race + "-Compare-Histogram.json");
            if (node.isObject()) {
                ObjectNode tagged = ((ObjectNode) node).deepCopy();
                tagged.put("race", race.toUpperCase());
                compareHist.add(tagged);
            }
        }
        response.add(compareHist);

        // [2] VRA Impact Threshold Table — placeholder until Compare-Threshold.json is generated
        response.add(objectMapper.createObjectNode());

        return response;
    }

    private JsonNode loadJsonNode(String resourcePath) throws IOException {
        return objectMapper.readTree(new ClassPathResource(resourcePath).getInputStream());
    }
}
