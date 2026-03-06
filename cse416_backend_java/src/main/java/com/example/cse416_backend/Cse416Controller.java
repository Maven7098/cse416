package com.example.cse416_backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class Cse416Controller {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Get 2 GeoJSON for the Homepage
    // Maps to / => /
    @GetMapping("/")
    public ResponseEntity<Map<String, JsonNode>> getHomePage() throws IOException {
        
        // Read file 1 from src/main/resources/assets/ia/IA-State.json
        JsonNode stateOne = objectMapper.readTree(
            new ClassPathResource("assets/ia/IA-State.json").getInputStream()
        );
        
        // Read file 2 from src/main/resources/geo2.json
        JsonNode stateTwo = objectMapper.readTree(
            new ClassPathResource("assets/ia/IA-State.json").getInputStream()
        );

        // Combine them into a Map
        Map<String, JsonNode> response = new HashMap<>();
        response.put("dataset1", stateOne);
        response.put("dataset2", stateTwo);

        // Return as JSON
        return ResponseEntity.ok(response);
    }

    // Get a State Package
    // Consists of 2 GeoJSON (District for District Select, Precinct for Heatmap)
    // And a State Data (Right-hand side display)
    @GetMapping("/district")
    public ResponseEntity<Map<String, JsonNode>> getStatePack(@RequestParam String currentState) throws IOException {
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
            Map<String, JsonNode> response = new HashMap<>();
                response.put("districtGeoJson", currentDistrict);
                response.put("precinctGeoJson", currentPrecinct);
                response.put("stateInfo", currentStateInfo);
                
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
            Map<String, JsonNode> response = new HashMap<>();
                response.put("districtGeoJson", currentDistrict);
                response.put("precinctGeoJson", currentPrecinct);
                response.put("stateInfo", currentStateInfo);
            
            System.out.println(response);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            Map<String, JsonNode> response = new HashMap<>();
                response.put("districtGeoJson", null);
                response.put("precinctGeoJson", null);
                response.put("stateInfo", null);
            return ResponseEntity.ok(response);
        }
    }

    // Get mapping for Gingles
    // Get Package for EI
    // Consists of 1 GeoJSON object (District for Heatmap)
    // And 3 Chart JSON Data (Gingles, EI Distribution, EI KDE)
    @GetMapping("/polarization")
    public ResponseEntity<Map<String, JsonNode>> getStateEiPack(@RequestParam String currentState) throws IOException {
        if (currentState.equals("ia")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
            JsonNode currentDistrict = objectMapper.readTree(
                new ClassPathResource("assets/ia/IA-Congress-Precinct.json").getInputStream()
            );
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
            Map<String, JsonNode> response = new HashMap<>();
                response.put("precinctGeoJson", currentDistrict);
                response.put("Gingles", gingles);
                response.put("StateEi", currentEi);
                response.put("StateKde", currentKde);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        else if (currentState.equals("ga")){
            // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
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
            Map<String, JsonNode> response = new HashMap<>();
                response.put("precinctGeoJson", currentDistrict);
                response.put("Gingles", gingles);
                response.put("StateEi", currentEi);
                response.put("StateKde", currentKde);
                
            // Return as JSON
            return ResponseEntity.ok(response);
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        else{
            Map<String, JsonNode> response = new HashMap<>();
                response.put("precinctGeoJson", null);
                response.put("StateEi", null);
                response.put("StateKde", null);
            return ResponseEntity.ok(response);
        }
    }
}