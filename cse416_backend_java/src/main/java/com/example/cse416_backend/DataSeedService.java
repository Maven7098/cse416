package com.example.cse416_backend;

import org.springframework.stereotype.Service;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.bson.Document;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class DataSeedService {

    private static final Logger logger = LoggerFactory.getLogger(DataSeedService.class);
    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final BoxDataRepository boxDataRepository;
    private final EnsembleDataRepository ensembleDataRepository;
    private final StateInfoRepository stateInfoRepository;
    private final PrecinctsGinglesRepository precinctsGinglesRepository;
    private final PolarizationDataRepository polarizationDataRepository;

    public DataSeedService(
        HomeGeoJsonRepository homeGeoJsonRepository,
        BoxDataRepository boxDataRepository,
        EnsembleDataRepository ensembleDataRepository,
        StateInfoRepository stateInfoRepository,
        PrecinctsGinglesRepository precinctsGinglesRepository,
        PolarizationDataRepository polarizationDataRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
        this.boxDataRepository = boxDataRepository;
        this.ensembleDataRepository = ensembleDataRepository;
        this.stateInfoRepository = stateInfoRepository;
        this.precinctsGinglesRepository = precinctsGinglesRepository;
        this.polarizationDataRepository = polarizationDataRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabase() {
        logger.info("===== Starting MongoDB Database Seeding =====");
        
        try {
            seedHomeGeoJsonData();
            seedBoxData();
            seedEnsembleData();
            seedStateInfo();
            seedPrecinctsGingles();
            seedPolarizationData();
        } catch (Exception e) {
            logger.error("Error during database seeding - continuing anyway", e);
        }
        
        logger.info("===== Database Seeding Completed =====");
    }

    private void seedHomeGeoJsonData() {
        try {
            logger.info("Seeding home_geojson collection...");

            if (homeGeoJsonRepository.findBycurrentState("ia").isEmpty()) {
                String iaJsonString = loadJsonStringFromClasspath("assets/ia/IA-State-GeoJSON.json");
                if (iaJsonString != null && !iaJsonString.isEmpty()) {
                    HomeGeoJsonDocument iaDoc = new HomeGeoJsonDocument();
                    iaDoc.setcurrentState("ia");
                    iaDoc.setPayload(Document.parse(iaJsonString));
                    homeGeoJsonRepository.save(iaDoc);
                    logger.info("  Seeded IA home_geojson document");
                }
            } else {
                logger.info("  IA home_geojson document already exists. Skipping.");
            }

            if (homeGeoJsonRepository.findBycurrentState("ga").isEmpty()) {
                String gaJsonString = loadJsonStringFromClasspath("assets/ga/GA-State-GeoJSON.json");
                if (gaJsonString != null && !gaJsonString.isEmpty()) {
                    HomeGeoJsonDocument gaDoc = new HomeGeoJsonDocument();
                    gaDoc.setcurrentState("ga");
                    gaDoc.setPayload(Document.parse(gaJsonString));
                    homeGeoJsonRepository.save(gaDoc);
                    logger.info("  Seeded GA home_geojson document");
                }
            } else {
                logger.info("  GA home_geojson document already exists. Skipping.");
            }

            logger.info("home_geojson seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding home_geojson data", e);
        }
    }

    private String loadJsonStringFromClasspath(String resourcePath) throws IOException {
        try {
            // Load from backend_java classpath resources
            ClassPathResource resource = new ClassPathResource(resourcePath);
            try (InputStream inputStream = resource.getInputStream()) {
                return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            logger.warn("Could not load file: {}", resourcePath);
            throw e;
        }
    }

    private void seedBoxData() {
        try {
            logger.info("Seeding box_data collection...");
            seedBoxDataForState("ia");
            seedBoxDataForState("ga");
            logger.info("box_data seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding box_data", e);
        }
    }

    private void seedBoxDataForState(String stateCode) throws IOException {
        String stateCodeUpper = stateCode.toUpperCase();
        
        // Seed Current data (merged from three race-specific files)
        if (boxDataRepository.findByCurrentStateAndMode(stateCode, "Current").isEmpty()) {
            String currentAsianJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-Current-Asian.json");
            String currentBlackJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-Current-Black.json");
            String currentHispanicJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-Current-Hispanic.json");
            
            if (currentAsianJson != null && currentBlackJson != null && currentHispanicJson != null) {
                Document mergedDoc = new Document();
                mergedDoc.put("Asian", parseJsonAsArray(currentAsianJson));
                mergedDoc.put("Black", parseJsonAsArray(currentBlackJson));
                mergedDoc.put("Hispanic", parseJsonAsArray(currentHispanicJson));
                
                BoxDataDocument doc = new BoxDataDocument(stateCode, "Current", mergedDoc);
                boxDataRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " box_data Current document");
            }
        }
        
        // Seed NonVRA data (merged from four race-specific files)
        if (boxDataRepository.findByCurrentStateAndMode(stateCode, "NonVRA").isEmpty()) {
            String nonvraJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Proposed-Box-NonVRA.json");
            String nonvraAsianJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-NonVRA-Asian.json");
            String nonvraBlackJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-NonVRA-Black.json");
            String nonvraHispanicJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-NonVRA-Hispanic.json");
            
            if (nonvraJson != null && nonvraAsianJson != null && nonvraBlackJson != null && nonvraHispanicJson != null) {
                Document mergedDoc = new Document();
                mergedDoc.put("Base", parseJsonAsArray(nonvraJson));
                mergedDoc.put("Asian", parseJsonAsArray(nonvraAsianJson));
                mergedDoc.put("Black", parseJsonAsArray(nonvraBlackJson));
                mergedDoc.put("Hispanic", parseJsonAsArray(nonvraHispanicJson));
                
                BoxDataDocument doc = new BoxDataDocument(stateCode, "NonVRA", mergedDoc);
                boxDataRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " box_data NonVRA document");
            }
        }
        
        // Seed VRA data (merged from four race-specific files)
        if (boxDataRepository.findByCurrentStateAndMode(stateCode, "VRA").isEmpty()) {
            String vraJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Proposed-Box-VRA.json");
            String vraAsianJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-VRA-Asian.json");
            String vraBlackJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-VRA-Black.json");
            String vraHispanicJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Box-Data-VRA-Hispanic.json");
            
            if (vraJson != null && vraAsianJson != null && vraBlackJson != null && vraHispanicJson != null) {
                Document mergedDoc = new Document();
                mergedDoc.put("Base", parseJsonAsArray(vraJson));
                mergedDoc.put("Asian", parseJsonAsArray(vraAsianJson));
                mergedDoc.put("Black", parseJsonAsArray(vraBlackJson));
                mergedDoc.put("Hispanic", parseJsonAsArray(vraHispanicJson));
                
                BoxDataDocument doc = new BoxDataDocument(stateCode, "VRA", mergedDoc);
                boxDataRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " box_data VRA document");
            }
        }
    }

    private void seedEnsembleData() {
        try {
            logger.info("Seeding ensemble_data collection...");
            seedEnsembleDataForState("ia");
            seedEnsembleDataForState("ga");
            logger.info("ensemble_data seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding ensemble_data", e);
        }
    }

    private void seedEnsembleDataForState(String stateCode) throws IOException {
        String stateCodeUpper = stateCode.toUpperCase();
        
        // Seed NonVRA data
        if (ensembleDataRepository.findByCurrentStateAndMode(stateCode, "NonVRA").isEmpty()) {
            String nonvraJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Proposed-Ensemble-NonVRA.json");
            if (nonvraJson != null && !nonvraJson.isEmpty()) {
                EnsembleDataDocument doc = new EnsembleDataDocument(
                    stateCode, "NonVRA", Document.parse(nonvraJson));
                ensembleDataRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " ensemble_data NonVRA document");
            }
        }
        
        // Seed VRA data
        if (ensembleDataRepository.findByCurrentStateAndMode(stateCode, "VRA").isEmpty()) {
            String vraJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Proposed-Ensemble-VRA.json");
            if (vraJson != null && !vraJson.isEmpty()) {
                EnsembleDataDocument doc = new EnsembleDataDocument(
                    stateCode, "VRA", Document.parse(vraJson));
                ensembleDataRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " ensemble_data VRA document");
            }
        }
    }

    private void seedStateInfo() {
        try {
            logger.info("Seeding state_info collection...");
            seedStateInfoForState("ia");
            seedStateInfoForState("ga");
            logger.info("state_info seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding state_info", e);
        }
    }

    private void seedStateInfoForState(String stateCode) throws IOException {
        String stateCodeUpper = stateCode.toUpperCase();
        
        if (stateInfoRepository.findByCurrentState(stateCode).isEmpty()) {
            String stateInfoJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-State-Info.json");
            if (stateInfoJson != null && !stateInfoJson.isEmpty()) {
                StateInfoDocument doc = new StateInfoDocument(stateCode, Document.parse(stateInfoJson));
                stateInfoRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " state_info document");
            }
        }
    }

    private void seedPrecinctsGingles() {
        try {
            logger.info("Seeding precincts_gingles collection...");
            seedPrecinctsGinglesForState("ia");
            seedPrecinctsGinglesForState("ga");
            logger.info("precincts_gingles seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding precincts_gingles", e);
        }
    }

    private void seedPolarizationData() {
        try {
            logger.info("Seeding polarization_data collection...");
            seedPolarizationDataForState("ia");
            seedPolarizationDataForState("ga");
            logger.info("polarization_data seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding polarization_data", e);
        }
    }

    private void seedPolarizationDataForState(String stateCode) throws IOException {
        if (polarizationDataRepository.findByCurrentState(stateCode).isPresent()) {
            logger.info("  {} polarization_data document already exists. Skipping.", stateCode.toUpperCase());
            return;
        }

        Document mergedPayload = new Document();
        mergedPayload.put("Asian", buildPolarizationRacePayload(stateCode, "Asian"));
        mergedPayload.put("Black", buildPolarizationRacePayload(stateCode, "Black"));
        mergedPayload.put("Hispanic", buildPolarizationRacePayload(stateCode, "Hispanic"));

        PolarizationDataDocument doc = new PolarizationDataDocument(stateCode, mergedPayload);
        polarizationDataRepository.save(doc);
        logger.info("  Seeded {} polarization_data document", stateCode.toUpperCase());
    }

    private Document buildPolarizationRacePayload(String stateCode, String race) throws IOException {
        String stateCodeUpper = stateCode.toUpperCase();

        String harrisJson = loadJsonStringFromClasspath(
            "assets/" + stateCode + "/" + stateCodeUpper + "_Polarization_" + race + "_Harris.json");
        String harrisKdeJson = loadJsonStringFromClasspath(
            "assets/" + stateCode + "/" + stateCodeUpper + "_Polarization_" + race + "_Harris_KDE.json");
        String trumpJson = loadJsonStringFromClasspath(
            "assets/" + stateCode + "/" + stateCodeUpper + "_Polarization_" + race + "_Trump.json");
        String trumpKdeJson = loadJsonStringFromClasspath(
            "assets/" + stateCode + "/" + stateCodeUpper + "_Polarization_" + race + "_Trump_KDE.json");

        Document racePayload = new Document();
        racePayload.put("Harris", buildPolarizationCandidatePayload(harrisJson, harrisKdeJson));
        racePayload.put("Trump", buildPolarizationCandidatePayload(trumpJson, trumpKdeJson));
        return racePayload;
    }

    private Document buildPolarizationCandidatePayload(String chartJson, String kdeJson) throws IOException {
        Document candidatePayload = new Document();
        if (chartJson != null && !chartJson.isEmpty()) {
            candidatePayload.put("chart", Document.parse(chartJson));
        }
        if (kdeJson != null && !kdeJson.isEmpty()) {
            candidatePayload.put("kde", Document.parse(kdeJson));
        }
        return candidatePayload;
    }

    private void seedPrecinctsGinglesForState(String stateCode) throws IOException {
        String stateCodeUpper = stateCode.toUpperCase();
        
        if (precinctsGinglesRepository.findByCurrentState(stateCode).isEmpty()) {
            String ginglesJson = loadJsonStringFromClasspath(
                "assets/" + stateCode + "/" + stateCodeUpper + "-Polarization-Gingles.json");
            if (ginglesJson != null && !ginglesJson.isEmpty()) {
                Document payloadDoc = new Document();
                payloadDoc.put("data", parseJsonAsArray(ginglesJson));
                PrecinctsGinglesDocument doc = new PrecinctsGinglesDocument(stateCode, payloadDoc);
                precinctsGinglesRepository.save(doc);
                logger.info("  Seeded " + stateCodeUpper + " precincts_gingles document");
            }
        }
    }

    private Object parseJsonAsArray(String jsonString) throws IOException {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return null;
        }
        
        String trimmed = jsonString.trim();
        // If it's a JSON array, wrap it in an object to parse correctly
        if (trimmed.startsWith("[")) {
            String wrappedJson = "{\"data\": " + jsonString + "}";
            Document doc = Document.parse(wrappedJson);
            return doc.get("data");
        } else {
            // If it's already an object, parse it directly
            return Document.parse(jsonString);
        }
    }
}
