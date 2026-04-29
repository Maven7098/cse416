package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class StatePolarizationService {

    private final PrecinctsGinglesRepository precinctsGinglesRepository;
    private final PolarizationDataRepository polarizationDataRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StatePolarizationService(PrecinctsGinglesRepository precinctsGinglesRepository, PolarizationDataRepository polarizationDataRepository) {
        this.precinctsGinglesRepository = precinctsGinglesRepository;
        this.polarizationDataRepository = polarizationDataRepository;
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            response.add(getGinglesPayload(currentState));
            response.add(getLocalPayload(currentState));
            response.add(objectMapper.createArrayNode());
            
            // Add polarization KDE data as element [3]
            Optional<PolarizationDataDocument> polarizationData = polarizationDataRepository.findByCurrentState(currentState);
            if (polarizationData.isPresent() && polarizationData.get().getPayload() != null) {
                JsonNode kdeNode = objectMapper.readTree(polarizationData.get().getPayload().toJson());
                response.add(kdeNode);
            } else {
                response.add(objectMapper.createObjectNode());
            }
        }
        return response;
    }

    private JsonNode getLocalPayload(String currentState) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        String resourceName = currentState.equals("ga")
            ? stateCodeUpper + "-Polarization-EI-GeoJSON.json"
            : stateCodeUpper + "-Precinct-EI-GeoJSON.json";

        return objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + resourceName).getInputStream()
        );
    }

    // Return the following:
    // Gingles Table (GUI-9, 10, 11)
    // Gingles Regression (as a math formula) (GUI-9)
    // EI Chart (GUI-13)
    // EI KDE Results (GUI-15)
    private JsonNode getGinglesPayload(String currentState) throws IOException {
        Optional<PrecinctsGinglesDocument> stateDoc = precinctsGinglesRepository.findByCurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing precincts_gingles payload for state: " + currentState);
        }

        JsonNode payloadNode = objectMapper.readTree(stateDoc.get().getPayload().toJson());
        JsonNode dataNode = payloadNode.get("data");
        if (dataNode == null || !dataNode.isArray()) {
            throw new IOException("Invalid precincts_gingles payload shape for state: " + currentState);
        }
        return dataNode;
    }
}
