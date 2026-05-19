package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Paths;

@Service
public class StateHeatmapService {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.assets.path}")
    private String assetsPath;

    public StateHeatmapService() {
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        // If state is IA or GA, call LocalPayload to fill response
        if(currentState.equals("ia") || currentState.equals("ga")){
            ArrayNode localPayload = getLocalPayload(currentState);
            response.add(localPayload.get(0));
            response.add(localPayload.get(1));
        }
        // Should only accept "ia" and "ga", nothing else
        // (we are not doing other states)
        return response;
    }

    // Get Precinct and Census Block Heatmap GeoJSON files
    // As both are stored locally, the Mongo is not called (No getMongoPayload)
    private ArrayNode getLocalPayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        String stateCodeUpper = currentState.toUpperCase();
        
        String precinctPath = "assets/" + currentState + "/" + stateCodeUpper + "-Precinct.topo.json";
        String censusPath = "assets/" + currentState + "/" + stateCodeUpper + "-CensusBlock.topo.json";

        // Heat map for Precinct (GUI-4)
        JsonNode currentPrecinct = objectMapper.readTree(getResource(precinctPath).getInputStream());
        // Heat map for Census Block (GUI-5)
        JsonNode currentCensusBlock = objectMapper.readTree(getResource(censusPath).getInputStream());
        
        response.add(currentPrecinct);
        response.add(currentCensusBlock);
        return response;
    }

    private Resource getResource(String resourcePath) {
        Resource resource = new FileSystemResource(Paths.get(assetsPath, resourcePath).toFile());
        if (!resource.exists()) {
            resource = new ClassPathResource(resourcePath);
        }
        return resource;
    }
}
