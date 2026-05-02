package com.example.cse416_backend;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.bson.Document;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class ProposedDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final BoxDataRepository boxDataRepository;
    private final EnsembleDataRepository ensembleDataRepository;

    public ProposedDataService(BoxDataRepository boxDataRepository,
                                EnsembleDataRepository ensembleDataRepository) {
        this.boxDataRepository = boxDataRepository;
        this.ensembleDataRepository = ensembleDataRepository;
    }

    public ArrayNode getHomePayload(String currentState, String currentMode,
                                     String count, String threshold) throws IOException {
        ArrayNode response = objectMapper.createArrayNode();
        if (!currentState.equals("ia") && !currentState.equals("ga")) return response;

        String modeToken;
        if (currentMode.equals("vra")) {
            modeToken = "VRA";
        } else if (currentMode.equals("non-vra")) {
            modeToken = "NonVRA";
        } else {
            return response;
        }

        String variantKey = count + "_" + threshold;

        // [0] District GeoJSON from classpath
        response.add(getLocalPayload(currentState));

        // [1] Ensemble histogram from MongoDB ensemble_data
        Optional<EnsembleDataDocument> ensDoc =
            ensembleDataRepository.findByCurrentStateAndMode(currentState, modeToken);
        if (ensDoc.isEmpty()) throw new IOException(
            "Missing ensemble_data for " + currentState + "/" + modeToken);
        Document ensVariant = (Document) ensDoc.get().getPayload().get(variantKey);
        response.add(objectMapper.readTree(ensVariant.toJson()));

        // [2] Box & whisker from MongoDB box_data, race-tagged
        Optional<BoxDataDocument> boxDoc =
            boxDataRepository.findByCurrentStateAndMode(currentState, modeToken);
        if (boxDoc.isEmpty()) throw new IOException(
            "Missing box_data for " + currentState + "/" + modeToken);
        Document boxVariant = (Document) boxDoc.get().getPayload().get(variantKey);
        response.add(buildRaceTaggedArrayFromDocument(boxVariant));

        // [3] Current-plan box placeholder (no current-variant files in new structure)
        response.add(objectMapper.createArrayNode());

        return response;
    }

    private JsonNode getLocalPayload(String currentState) throws IOException {
        String resourceName = currentState.toUpperCase() + "-District-Current-GeoJSON.json";
        return objectMapper.readTree(
            new ClassPathResource("assets/" + currentState + "/" + resourceName).getInputStream());
    }

    private ArrayNode buildRaceTaggedArrayFromDocument(Document variantDoc) throws IOException {
        ArrayNode output = objectMapper.createArrayNode();
        for (String race : new String[]{"Asian", "Black", "Hispanic"}) {
            Object raceData = variantDoc.get(race);
            if (raceData == null) continue;
            // parseJsonAsArray stores JSON arrays as List<Document> inside BSON.
            // Wrap in a temporary document to safely serialize back to JSON.
            String raceJson = new Document("data", raceData).toJson();
            JsonNode raceArray = objectMapper.readTree(raceJson).get("data");
            if (raceArray == null || !raceArray.isArray()) continue;
            for (JsonNode item : raceArray) {
                if (item.isObject()) {
                    ObjectNode tagged = ((ObjectNode) item).deepCopy();
                    tagged.put("race", race.toUpperCase());
                    output.add(tagged);
                }
            }
        }
        return output;
    }
}
