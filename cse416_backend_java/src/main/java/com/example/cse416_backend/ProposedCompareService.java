package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class ProposedCompareService {

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProposedCompareService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    private ArrayNode loadCurrentBoxData(String currentState) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        ArrayNode currentBoxData = objectMapper.createArrayNode();
        currentBoxData.addAll((ArrayNode) objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-Current-Asian.json").getInputStream()
        ));
        currentBoxData.addAll((ArrayNode) objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-Current-Black.json").getInputStream()
        ));
        currentBoxData.addAll((ArrayNode) objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-Current-Hispanic.json").getInputStream()
        ));
        return currentBoxData;
    }

    public JsonNode getHomePayload(String currentState, String currentMode) throws IOException {
        if (!(currentState.equals("ia") || currentState.equals("ga"))) {
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            return response;
        }

        String stateCodeUpper = currentState.toUpperCase();

        if (currentMode.equals("map")) {
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-District-Current-GeoJSON.json").getInputStream()
            );
            JsonNode proposedDistrictVra = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + currentState + "_recom_generated_plan.geojson").getInputStream()
            );
            JsonNode proposedDistrictNonVra = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-District-NonVRA-GeoJSON.json").getInputStream()
            );

            ArrayNode response = objectMapper.createArrayNode();
            response.add(currentDistrict);
            response.add(proposedDistrictVra);
            response.add(proposedDistrictNonVra);
            return response;
        }

        if (currentMode.equals("chart")) {
            JsonNode vraEnsemble = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Ensemble-Data-VRA.json").getInputStream()
            );
            JsonNode nonVraEnsemble = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Ensemble-Data-NonVRA.json").getInputStream()
            );
            JsonNode currentBox = loadCurrentBoxData(currentState);
            JsonNode vraBox = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-VRA.json").getInputStream()
            );
            JsonNode nonVraBox = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-NonVRA.json").getInputStream()
            );

            ArrayNode response = objectMapper.createArrayNode();
            response.add(vraEnsemble);
            response.add(nonVraEnsemble);
            response.add(currentBox);
            response.add(vraBox);
            response.add(nonVraBox);
            return response;
        }

        if (currentMode.equals("vra") || currentMode.equals("non-vra")) {
            JsonNode proposedDistrict;
            if (currentMode.equals("vra")) {
                proposedDistrict = objectMapper.readTree(
                    new ClassPathResource("assets/" + currentState + "/" + currentState + "_recom_generated_plan.geojson").getInputStream()
                );
            } else {
                proposedDistrict = objectMapper.readTree(
                    new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Congress-District-NonVRA-GeoJSON.json").getInputStream()
                );
            }
            JsonNode ensemble = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Ensemble-Data-" + (currentMode.equals("vra") ? "VRA" : "NonVRA") + ".json").getInputStream()
            );
            JsonNode boxChart = objectMapper.readTree(
                new ClassPathResource("assets/" + currentState + "/" + stateCodeUpper + "-Box-Data-" + (currentMode.equals("vra") ? "VRA" : "NonVRA") + ".json").getInputStream()
            );
            JsonNode circleChart = loadCurrentBoxData(currentState);

            ArrayNode response = objectMapper.createArrayNode();
            response.add(proposedDistrict);
            response.add(ensemble);
            response.add(boxChart);
            response.add(circleChart);
            return response;
        }

        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        ArrayNode response = objectMapper.createArrayNode();
        response.add((JsonNode) null);
        response.add((JsonNode) null);
        response.add((JsonNode) null);
        return response;
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
