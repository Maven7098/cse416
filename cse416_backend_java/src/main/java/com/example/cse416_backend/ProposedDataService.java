package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class ProposedDataService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProposedDataService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState, String currentMode) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            if(currentMode.equals("vra")){
                response.add(getLocalPayload(currentState, "VRA"));
                response.add(getMongoPayload(currentState, "VRA"));
            }
            else if(currentMode.equals("non-vra")){
                response.add(getLocalPayload(currentState, "NonVRA"));
                response.add(getMongoPayload(currentState, "NonVRA"));
            }
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        return response;
    }

    // Return the State (IA or GA) District GeoJSON file from local storage
    // Satisfies GUI-19 (display 'a' interesting district) - can it be multiple district plans though?
    // vra or non-vra: Should it be a string or a C-style boolean (1 or 0)?
    private JsonNode getLocalPayload(String currentState, String currentMode) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        String stateCodeUpper = currentState.toUpperCase();
        // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
        JsonNode currentDistrict = objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-District-Proposed-GeoJSON-" + currentMode + ".json").getInputStream()
        );

        // Combine them into a Map
        response.add(currentDistrict);
            
        // Return as JSON
        return response;
    }

    // Return the following:
    // Ensemble Splits Chart (GUI-16)
    // Box and Whisker Chart (GUI-17)
    private JsonNode getMongoPayload(String currentState, String currentMode) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
