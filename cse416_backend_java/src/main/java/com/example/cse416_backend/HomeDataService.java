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

    // Call getMongoPayload
    // And merge them as ArrayNode
    public ArrayNode getHomePayload() throws IOException {
        JsonNode iaNode = getMongoPayload("ia");
        JsonNode gaNode = getMongoPayload("ga");

        ArrayNode response = objectMapper.createArrayNode();
        response.add(iaNode);
        response.add(gaNode);
        return response;
    }

    // Get the state GeoJSON file from Mongo
    // Unlike other GeoJSON files, State sized files are small enough to be stored
    // Should we get the currentState variable or leave it out?
    private JsonNode getMongoPayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
