package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class GetStateHeatmapService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GetStateHeatmapService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    public JsonNode getHomePayload(String currentState) throws IOException {
        if (currentState.equals("ia") || currentState.equals("ga")){
        JsonNode iaNode = getStatePayload("ia");
        JsonNode gaNode = getStatePayload("ga");

        // Heat map for Precinct (GUI-4)
        JsonNode currentPrecinct = objectMapper.readTree(
            new ClassPathResource("assets/ia/IA-Congress-Precinct-Current-GeoJSON.json").getInputStream()
        );
        // Heat map for Census Block (GUI-5)
        JsonNode currentCensusBlock = objectMapper.readTree(
            new ClassPathResource("assets/ia/IA-Congress-CensusBlock-Current-GeoJSON.json").getInputStream()
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

    private JsonNode getStatePayload(String stateCode) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findByStateCode(stateCode);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + stateCode);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
