package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class StateHeatmapService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StateHeatmapService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    public JsonNode getHomePayload(String currentState) throws IOException {
        if (currentState.equals("ia") || currentState.equals("ga")){
        String stateCodeUpper = currentState.toUpperCase();

        // Heat map for Precinct (GUI-4)
        JsonNode currentPrecinct = objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-Precinct-GeoJSON.json").getInputStream()
        );
        // Heat map for Census Block (GUI-5)
        JsonNode currentCensusBlock = objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-CensusBlock-GeoJSON.json").getInputStream()
        );

        ArrayNode response = objectMapper.createArrayNode();
        response.add(currentPrecinct);
        response.add(currentCensusBlock);
        return response;
    }
    else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return response;
        }
    }

    private JsonNode getStatePayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
