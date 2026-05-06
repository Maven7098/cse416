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
public class StatePolarizationService {

    private final PrecinctsGinglesRepository precinctsGinglesRepository;
    private final PolarizationDataRepository polarizationDataRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.assets.path}")
    private String assetsPath;

    public StatePolarizationService(PrecinctsGinglesRepository precinctsGinglesRepository, PolarizationDataRepository polarizationDataRepository) {
        this.precinctsGinglesRepository = precinctsGinglesRepository;
        this.polarizationDataRepository = polarizationDataRepository;
    }

    // Calls both getLocalPayload and getMongoPayload
    // And appends them as a JsonNode (or ArrayNode)
    public ArrayNode getHomePayload(String currentState) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (currentState.equals("ia") || currentState.equals("ga")){
            response.add(getGinglesPayload(currentState));
            response.add(getLocalPayload(currentState));
            
            // Add polarization KDE data as element [2]
            Optional<PolarizationDataDocument> polarizationData = polarizationDataRepository.findByCurrentState(currentState);
            if (polarizationData.isPresent() && polarizationData.get().getPayload() != null) {
                JsonNode kdeNode = objectMapper.readTree(polarizationData.get().getPayload().toJson());
                response.add(kdeNode);
            } else {
                response.add(objectMapper.createObjectNode());
            }
        }
        return response;
    }

    private JsonNode getLocalPayload(String currentState) throws IOException {
        String stateCodeUpper = currentState.toUpperCase();
        String resourceName = stateCodeUpper + "-Polarization-EI-GeoJSON.json";
        String resourcePath = "assets/" + currentState + "/" + resourceName;

        return objectMapper.readTree(getResource(resourcePath).getInputStream());
    }

    private Resource getResource(String resourcePath) {
        Resource resource = new FileSystemResource(Paths.get(assetsPath, resourcePath).toFile());
        if (!resource.exists()) {
            resource = new ClassPathResource(resourcePath);
        }
        return resource;
    }

    // Return the following:
    // Gingles Table (GUI-9, 10, 11)
    // Gingles Regression (as a math formula) (GUI-9)
    // EI Chart (GUI-13)
    // EI KDE Results (GUI-15)
    private ArrayNode getGinglesPayload(String currentState) throws IOException {
        Optional<PrecinctsGinglesDocument> stateDoc = precinctsGinglesRepository.findByCurrentState(currentState);
        if (stateDoc.isEmpty() || stateDoc.get().getPayload() == null) {
            throw new IOException("Missing precincts_gingles payload for state: " + currentState);
        }

        JsonNode payloadNode = objectMapper.readTree(stateDoc.get().getPayload().toJson());
        ArrayNode response = objectMapper.createArrayNode();
        JsonNode dataNode = payloadNode.get("Data");
        JsonNode asianNode = payloadNode.get("Asian");
        JsonNode blackNode = payloadNode.get("Black");
        JsonNode hispanicNode = payloadNode.get("Hispanic");
        if (dataNode == null || !dataNode.isArray()) {
            throw new IOException("Invalid precincts_gingles payload shape for state: " + currentState);
        }
        if (asianNode == null || blackNode == null || hispanicNode == null) {
            throw new IOException("Invalid precincts_gingles payload line for state: " + currentState);
        }
        response.add(dataNode);
        response.add(asianNode);
        response.add(blackNode);
        response.add(hispanicNode);
        return response;
    }
}
