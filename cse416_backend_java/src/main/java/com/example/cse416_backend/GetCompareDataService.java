package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class GetCompareDataService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GetCompareDataService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    public JsonNode getHomePayload(String currentState, String currentMode) throws IOException {
        if (currentState.equals("ia") && currentMode.equals("map")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District.json").getInputStream()
            );
            JsonNode vraDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District-VRA.json").getInputStream()
            );
            JsonNode nonVraDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District-NonVRA.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(currentDistrict);
            response.add(vraDistrict);
            response.add(nonVraDistrict);
                
            // Return as JSON
            return response;
        }
        if (currentState.equals("ia") && currentMode.equals("chart")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode ensembleVra = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Ensemble-VRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensembleNonVra = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Ensemble-NonVRA.json").getInputStream()
            );
            // Current Racial Distribution used for dots
            JsonNode boxCurrent = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-Current.json").getInputStream()
            );
            JsonNode boxVra = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-VRA.json").getInputStream()
            );
            JsonNode boxNonVra = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-NonVRA.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(ensembleVra);
            response.add(ensembleNonVra);
            response.add(boxCurrent);
            response.add(boxVra);
            response.add(boxNonVra);
                
            // Return as JSON
            return response;
        }
        if (currentState.equals("ga") && currentMode.equals("map")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District.json").getInputStream()
            );
            JsonNode vraDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District-VRA.json").getInputStream()
            );
            JsonNode nonVraDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District-NonVRA.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(currentDistrict);
            response.add(vraDistrict);
            response.add(nonVraDistrict);
                
            // Return as JSON
            return response;
        }
        if (currentState.equals("ga") && currentMode.equals("chart")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode ensembleVra = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Ensemble-VRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensembleNonVra = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Ensemble-NonVRA.json").getInputStream()
            );
            // Current Racial Distribution used for dots
            JsonNode boxCurrent = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-Current.json").getInputStream()
            );
            JsonNode boxVra = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-VRA.json").getInputStream()
            );
            JsonNode boxNonVra = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-NonVRA.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(ensembleVra);
            response.add(ensembleNonVra);
            response.add(boxCurrent);
            response.add(boxVra);
            response.add(boxNonVra);
                
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

    private JsonNode getStatePayload(String currentState) throws IOException {
        Optional<HomeGeoJsonDocument> stateDoc = homeGeoJsonRepository.findBycurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing home_geojson payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
