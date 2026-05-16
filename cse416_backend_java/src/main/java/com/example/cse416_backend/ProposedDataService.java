package com.example.cse416_backend;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import org.bson.Document;
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

        // [0] Ensemble splits from MongoDB ensemble_data
        Optional<EnsembleDataDocument> ensDoc =
            ensembleDataRepository.findByCurrentStateAndMode(currentState, modeToken);
        if (ensDoc.isEmpty()) throw new IOException(
            "Missing ensemble_data for " + currentState + "/" + modeToken);
        Document ensVariant = (Document) ensDoc.get().getPayload().get(variantKey);
        response.add(objectMapper.readTree(ensVariant.toJson()));

        // [1] Box & whisker keyed by race (ASIAN/BLACK/HISPANIC) from MongoDB box_data
        Optional<BoxDataDocument> boxDoc =
            boxDataRepository.findByCurrentStateAndMode(currentState, modeToken);
        if (boxDoc.isEmpty()) throw new IOException(
            "Missing box_data for " + currentState + "/" + modeToken);
        Document boxVariant = (Document) boxDoc.get().getPayload().get(variantKey);
        response.add(buildRaceKeyedObject(boxVariant, ""));

        // [2] Minority effectiveness keyed by race from MongoDB box_data (histogram entries)
        response.add(buildRaceKeyedObject(boxVariant, "Histogram"));

        return response;
    }

    private ObjectNode buildRaceKeyedObject(Document variantDoc, String keySuffix) throws IOException {
        ObjectNode output = objectMapper.createObjectNode();
        for (String race : new String[]{"Asian", "Black", "Hispanic", "White"}) {
            Object raceData = variantDoc.get(race + keySuffix);
            if (raceData == null) continue;
            output.set(race.toUpperCase(), objectMapper.readTree(((Document) raceData).toJson()));
        }
        return output;
    }
}
