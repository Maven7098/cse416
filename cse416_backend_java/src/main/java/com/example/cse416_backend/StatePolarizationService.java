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

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StatePolarizationService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            response.add(getLocalPayload(currentState));
            response.add(getMongoPayload(currentState));
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        return response;
    }

    // Return the State (IA or GA) District GeoJSON file from local storage
    // Display EI Heatmap (GUI-14)
    private JsonNode getLocalPayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();

        String stateCodeUpper = currentState.toUpperCase();
        // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
        JsonNode currentDistrict = objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Precinct-EI-GeoJSON.json").getInputStream()
        );

        // Combine them into a Map
        response.add(currentDistrict);
            
        // Return as JSON
        return response;
    }

    // Return the following:
    // Gingles Table (GUI-9, 10, 11)
    // Gingles Regression (as a math formula) (GUI-9)
    // EI Chart (GUI-13)
    // EI KDE Results (GUI-15)
    private JsonNode getMongoPayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
