package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class Cse416Controller {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Get 2 GeoJSON for the Homepage
    // Maps to / => /
    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<JsonNode> getHomePage() throws IOException {
        
        // Read file 1 from src/main/resources/assets/ia/IA-State.json
        JsonNode stateOne = objectMapper.readTree(
            new ClassPathResource("assets/ia/IA-State.json").getInputStream()
        );
        
        // Read file 2 from src/main/resources/geo2.json
        JsonNode stateTwo = objectMapper.readTree(
            new ClassPathResource("assets/ga/GA-State.json").getInputStream()
        );

        // Combine them into a Map
        ArrayNode response = objectMapper.createArrayNode();
        response.add(stateOne);
        response.add(stateTwo);

        // Return as JSON
        return ResponseEntity.ok(response);
    }

    // Get a State Package
    // Consists of 2 GeoJSON (District for District Select, Precinct for Heatmap)
    // And a State Data (Right-hand side display)
    @GetMapping(value = "/district", produces = "application/json")
    public ResponseEntity<JsonNode> getStatePack(@RequestParam String currentState) throws IOException {
        if (currentState.equals("ia")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District.json").getInputStream()
            );
            // Read file 2 from src/main/resources/assets/ia/IA-Congress-Precinct.json
            JsonNode currentPrecinct = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-Precinct.json").getInputStream()
            );
            // Read file 3 from src/main/resources/assets/ia/IA-State-Info.json
            JsonNode currentStateInfo = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-State-Info.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(currentDistrict);
            response.add(currentPrecinct);
            response.add(currentStateInfo);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        else if (currentState.equals("ga")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District.json").getInputStream()
            );
            // Read file 2 from src/main/resources/assets/ia/IA-Congress-Precinct.json
            JsonNode currentPrecinct = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-Precinct.json").getInputStream()
            );
            // Read file 3 from src/main/resources/assets/ia/IA-State-Info.json
            JsonNode currentStateInfo = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-State-Info.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(currentDistrict);
            response.add(currentPrecinct);
            response.add(currentStateInfo);

            // Return as JSON
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return ResponseEntity.ok(response);
        }
    }

    // Get mapping for Gingles
    // Get Package for EI
    // Consists of 1 GeoJSON object (District for Heatmap)
    // And 3 Chart JSON Data (Gingles, EI Distribution, EI KDE)
    @GetMapping(value = "/polarization", produces = "application/json")
    public ResponseEntity<JsonNode> getStateEiPack(@RequestParam String currentState) throws IOException {
        if (currentState.equals("ia")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-Precinct.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode gingles = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Precinct-Output.json").getInputStream()
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
            return ResponseEntity.ok(response);
        }
        else if (currentState.equals("ga")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-Precinct.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode gingles = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Precinct-Output.json").getInputStream()
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
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return ResponseEntity.ok(response);
        }
    }

    @GetMapping(value = "/proposed", produces = "application/json")
    public ResponseEntity<JsonNode> getProposed(@RequestParam String currentState, String currentMode) throws IOException {
        if (currentState.equals("ia") && currentMode.equals("vra")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode proposedDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District-VRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensemble = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Ensemble-VRA.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode boxChart = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-VRA.json").getInputStream()
            );
            JsonNode circleChart = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-Current.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(proposedDistrict);
            response.add(ensemble);
            response.add(boxChart);
            response.add(circleChart);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        if (currentState.equals("ia") && currentMode.equals("non-vra")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode proposedDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-District-NonVRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensemble = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Ensemble-NonVRA.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode boxChart = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-NonVRA.json").getInputStream()
            );
            JsonNode circleChart = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Box-Current.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(proposedDistrict);
            response.add(ensemble);
            response.add(boxChart);
            response.add(circleChart);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        if (currentState.equals("ga") && currentMode.equals("vra")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode proposedDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District-VRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensemble = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Ensemble-VRA.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode boxChart = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-VRA.json").getInputStream()
            );
            JsonNode circleChart = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-Current.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(proposedDistrict);
            response.add(ensemble);
            response.add(boxChart);
            response.add(circleChart);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        if (currentState.equals("ga") && currentMode.equals("non-vra")){
            // Read file 1 from src/main/resources/assets/ga/GA-Congress-District.json
            JsonNode proposedDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Congress-District-NonVRA.json").getInputStream()
            );
            // IA does not return ASIAN or BLACK values as they are not viable ethnic categories
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode ensemble = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Ensemble-NonVRA.json").getInputStream()
            );
            // EI file (Black / NonBlack / Hispanic / NonHispanic / Asian / NonAsian / White? / NonWhite?)
            JsonNode boxChart = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-NonVRA.json").getInputStream()
            );
            JsonNode circleChart = objectMapper.readTree(
                new ClassPathResource("assets/ga/GA-Box-Current.json").getInputStream()
            );

            // Combine them into a Map
            ArrayNode response = objectMapper.createArrayNode();
            response.add(proposedDistrict);
            response.add(ensemble);
            response.add(boxChart);
            response.add(circleChart);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return ResponseEntity.ok(response);
        }
    }

    @GetMapping(value = "/compare", produces = "application/json")
    public ResponseEntity<JsonNode> getCompare(@RequestParam String currentState, String currentMode) throws IOException {
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
            return ResponseEntity.ok(response);
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
            return ResponseEntity.ok(response);
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
            return ResponseEntity.ok(response);
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
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            ArrayNode response = objectMapper.createArrayNode();
            response.add((JsonNode) null);
            response.add((JsonNode) null);
            response.add((JsonNode) null);

            return ResponseEntity.ok(response);
        }
    }
}