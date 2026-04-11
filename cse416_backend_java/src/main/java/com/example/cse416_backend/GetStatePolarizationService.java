package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class GetStatePolarizationService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GetStatePolarizationService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    public JsonNode getHomePayload(String currentState) throws IOException {
        if (currentState.equals("ia")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Precinct-EI-GeoJSON.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode gingles = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Precinct-Gingles.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode currentEi = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Precinct-EI.json").getInputStream()
            );
            // KDE File
            JsonNode currentKde = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Precinct-KDE.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(gingles);
            response.add(currentDistrict);
            response.add(currentEi);
            response.add(currentKde);
                
            // Return as JSON
            return response;
        }
        else if (currentState.equals("ga")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Precinct-EI-GeoJSON.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode gingles = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Precinct-Gingles.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode currentEi = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Precinct-EI.json").getInputStream()
            );
            // KDE File
            JsonNode currentKde = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Precinct-KDE.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(gingles);
            response.add(currentDistrict);
            response.add(currentEi);
            response.add(currentKde);

            // Return as JSON
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
