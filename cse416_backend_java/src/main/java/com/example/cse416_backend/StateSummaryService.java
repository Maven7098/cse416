package com.example.cse416_backend;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

@Service
public class StateSummaryService {

    private final StateInfoRepository stateInfoRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.assets.path}")
    private String assetsPath;

    public StateSummaryService(StateInfoRepository stateInfoRepository) {
        this.stateInfoRepository = stateInfoRepository;
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            response.add(getLocalPayload(currentState));
            response.add(getMongoPayload(currentState));
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        return response;
    }

    // Return the State (IA or GA) District GeoJSON file from local storage
    private JsonNode getLocalPayload(String currentState) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        String resourcePath = "assets/" + currentState + "/" + stateCodeUpper + "-District-Current.topo.json";
        
        // Read file 1 from src/main/resources/assets/ia/IA-Congress-District.json
        JsonNode currentDistrict = objectMapper.readTree(getResource(resourcePath).getInputStream());

        // Combine them into a Map
        return currentDistrict;
    }

    private Resource getResource(String resourcePath) {
        Resource resource = new FileSystemResource(Paths.get(assetsPath, resourcePath).toFile());
        if (!resource.exists()) {
            resource = new ClassPathResource(resourcePath);
        }
        return resource;
    }

    // Return the State information (State data summary) as per GUI-3 from Mongo
    // Read file 3 from src/main/resources/assets/ia/IA-State-Info.json
    private JsonNode getMongoPayload(String currentState) throws IOException{
        Optional<StateInfoDocument> stateDoc = stateInfoRepository.findByCurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing state_info payload for state: " + currentState);
        }
        return objectMapper.readTree(stateDoc.get().getPayload().toJson());
    }
}
