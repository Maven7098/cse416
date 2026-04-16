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

    public JsonNode getHomePayload(String currentState) throws IOException {
        if (currentState.equals("ia") || currentState.equals("ga")) {
            String stateCodeUpper = currentState.toUpperCase();
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Precinct-EI-GeoJSON.json").getInputStream()
            );
            JsonNode gingles = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Precinct-Gingles.json").getInputStream()
            );

            // EI/KDE split files are not present in the remapped dataset.
            JsonNode currentEi = objectMapper.createArrayNode();
            JsonNode currentKde = objectMapper.createArrayNode();

            ArrayNode response = objectMapper.createArrayNode();
            response.add(gingles);
            response.add(currentDistrict);
            response.add(currentEi);
            response.add(currentKde);
            return response;
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return response;
        }
    }

    // Get a State Package
    // Consists of 2 GeoJSON (District for District Select, Precinct for Heatmap)
    // And a State Data (Right-hand side display)
    private JsonNode getStatePayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
