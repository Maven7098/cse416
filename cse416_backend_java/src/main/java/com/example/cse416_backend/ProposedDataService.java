package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProposedDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProposedDataService() {
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState, String currentMode) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            String modeToken;
            if (currentMode.equals("vra")) {
                modeToken = "VRA";
            } else if (currentMode.equals("non-vra")) {
                modeToken = "NonVRA";
            } else {
                return response;
            }

            String stateCodeUpper = currentState.toUpperCase();
            response.add(getLocalPayload(currentState, modeToken));
            response.add(loadJsonObjectFromClasspath("assets/" + currentState + "/" + stateCodeUpper + "-Proposed-Ensemble-" + modeToken + ".json"));
            response.add(loadRaceTaggedSeries(currentState, "Box-Data-" + modeToken));
            response.add(loadRaceTaggedSeries(currentState, "Box-Data-Current"));
        }
        return response;
    }

    // Return the State (IA or GA) District GeoJSON file from local storage
    // Satisfies GUI-19 (display 'a' interesting district) - can it be multiple district plans though?
    // vra or non-vra: Should it be a string or a C-style boolean (1 or 0)?
    private JsonNode getLocalPayload(String currentState, String currentMode) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        String resourceName;

        if (currentMode.equals("NonVRA")) {
            resourceName = stateCodeUpper + "-Proposed-District-NonVRA-GeoJSON.json";
        } else {
            // The VRA-specific proposed district file was renamed away; fall back to the current district GeoJSON.
            resourceName = stateCodeUpper + "-District-Current-GeoJSON.json";
        }

        return objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + resourceName).getInputStream()
        );
    }

    private ObjectNode loadJsonObjectFromClasspath(String resourcePath) throws IOException {
        JsonNode node = objectMapper.readTree(new ClassPathResource(resourcePath).getInputStream());
        if (node == null || !node.isObject()) {
            throw new IOException("Invalid JSON object payload: " + resourcePath);
        }
        return (ObjectNode) node;
    }

    private ArrayNode loadRaceTaggedSeries(String currentState, String fileSuffix) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        ArrayNode output = objectMapper.createArrayNode();

        appendRaceSeries(output, currentState, stateCodeUpper + "-" + fileSuffix + "-Asian.json", "ASIAN");
        appendRaceSeries(output, currentState, stateCodeUpper + "-" + fileSuffix + "-Black.json", "BLACK");
        appendRaceSeries(output, currentState, stateCodeUpper + "-" + fileSuffix + "-Hispanic.json", "HISPANIC");

        return output;
    }

    private void appendRaceSeries(ArrayNode output, String currentState, String filename, String race) throws IOException {
        JsonNode node = objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + filename).getInputStream()
        );

        if (node == null || !node.isArray()) {
            return;
        }

        for (JsonNode item : node) {
            if (item != null && item.isObject()) {
                ObjectNode withRace = ((ObjectNode) item).deepCopy();
                withRace.put("race", race);
                output.add(withRace);
            }
        }
    }
}
