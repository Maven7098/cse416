package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class HomeDataService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public HomeDataService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    public JsonNode getHomePayload() throws IOException {
        JsonNode iaNode = getStatePayload("ia");
        JsonNode gaNode = getStatePayload("ga");

        ArrayNode response = objectMapper.createArrayNode();
        response.add(iaNode);
        response.add(gaNode);
        return response;
    }

    private JsonNode getStatePayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
