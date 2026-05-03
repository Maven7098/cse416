package com.example.cse416_backend;

import org.springframework.stereotype.Service;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.bson.Document;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;

@Service
public class DataSeedService {

    private static final Logger logger = LoggerFactory.getLogger(DataSeedService.class);
    private static final String[] COUNTS = {"256", "4096"};
    private static final String[] THRESHOLDS = {"Low", "Medium", "High"};
    private static final String[] RACES = {"Asian", "Black", "Hispanic"};

    @Value("${app.assets.path}")
    private String assetsPath;

    private final HomeGeoJsonRepository homeGeoJsonRepository;
    private final BoxDataRepository boxDataRepository;
    private final EnsembleDataRepository ensembleDataRepository;
    private final StateInfoRepository stateInfoRepository;
    private final PrecinctsGinglesRepository precinctsGinglesRepository;
    private final PolarizationDataRepository polarizationDataRepository;
    private final CompareDataRepository compareDataRepository;

    public DataSeedService(
        HomeGeoJsonRepository homeGeoJsonRepository,
        BoxDataRepository boxDataRepository,
        EnsembleDataRepository ensembleDataRepository,
        StateInfoRepository stateInfoRepository,
        PrecinctsGinglesRepository precinctsGinglesRepository,
        PolarizationDataRepository polarizationDataRepository,
        CompareDataRepository compareDataRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
        this.boxDataRepository = boxDataRepository;
        this.ensembleDataRepository = ensembleDataRepository;
        this.stateInfoRepository = stateInfoRepository;
        this.precinctsGinglesRepository = precinctsGinglesRepository;
        this.polarizationDataRepository = polarizationDataRepository;
        this.compareDataRepository = compareDataRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabase() {
        logger.info("===== Starting MongoDB Database Seeding =====");
        
        try {
            seedHomeGeoJsonData();
            seedBoxData();
            seedCompareData();
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
                String iaJsonString = loadJsonString("assets/ia/IA-State-GeoJSON.json");
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
                String gaJsonString = loadJsonString("assets/ga/GA-State-GeoJSON.json");
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

    private String loadJsonString(String resourcePath) throws IOException {
        try {
            // Try loading from filesystem first using the configured assets path
            Resource resource = new FileSystemResource(Paths.get(assetsPath, resourcePath).toFile());
            if (!resource.exists()) {
                // Fallback to classpath if not found on filesystem (e.g. if running from a clean jar)
                resource = new ClassPathResource(resourcePath);
            }
            
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
        String stateUpper = stateCode.toUpperCase();

        for (String mode : new String[]{"VRA", "NonVRA"}) {
            if (!boxDataRepository.findByCurrentStateAndMode(stateCode, mode).isEmpty()) {
                logger.info("  {} box_data {} document already exists. Skipping.", stateUpper, mode);
                continue;
            }

            Document payloadDoc = new Document();
            for (String count : COUNTS) {
                for (String threshold : THRESHOLDS) {
                    String folder = "Complete_" + count + "_" + threshold;
                    String variantKey = count + "_" + threshold;
                    String base = "assets/" + stateCode + "/" + folder
                                + "/NEW-" + stateUpper + "-Precinct-";

                    Document variantDoc = new Document();
                    for (String race : RACES) {
                        String boxPath = base + race + "-" + mode + "-Box.json";
                        variantDoc.put(race, Document.parse(loadJsonString(boxPath)));

                        String histPath = base + race + "-" + mode + "-Majority-Histogram.json";
                        variantDoc.put(race + "Histogram", Document.parse(loadJsonString(histPath)));
                    }
                    payloadDoc.put(variantKey, variantDoc);
                }
            }

            boxDataRepository.save(new BoxDataDocument(stateCode, mode, payloadDoc));
            logger.info("  Seeded {} box_data {} document", stateUpper, mode);
        }
    }

    private void seedCompareData() {
        try {
            logger.info("Seeding compare_data collection...");
            seedCompareDataForState("ia");
            seedCompareDataForState("ga");
            logger.info("compare_data seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error seeding compare_data", e);
        }
    }

    private void seedCompareDataForState(String stateCode) throws IOException {
        String stateUpper = stateCode.toUpperCase();

        if (compareDataRepository.findByCurrentState(stateCode).isPresent()) {
            logger.info("  {} compare_data document already exists. Skipping.", stateUpper);
            return;
        }

        Document payloadDoc = new Document();
        for (String count : COUNTS) {
            for (String threshold : THRESHOLDS) {
                String folder = "Complete_" + count + "_" + threshold;
                String variantKey = count + "_" + threshold;
                String base = "assets/" + stateCode + "/" + folder
                            + "/NEW-" + stateUpper + "-Precinct-";

                Document variantDoc = new Document();
                variantDoc.put("compareThreshold", Document.parse(loadJsonString(base + "Compare-Threshold.json")));
                variantDoc.put("compareBox", buildCompareRaceKeyedDoc(base, "-Compare-Box.json"));
                variantDoc.put("compareHistogram", buildCompareRaceKeyedDoc(base, "-Compare-Histogram.json"));
                payloadDoc.put(variantKey, variantDoc);
            }
        }

        compareDataRepository.save(new CompareDataDocument(stateCode, payloadDoc));
        logger.info("  Seeded {} compare_data document", stateUpper);
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
        String stateUpper = stateCode.toUpperCase();

        for (String mode : new String[]{"VRA", "NonVRA"}) {
            if (!ensembleDataRepository.findByCurrentStateAndMode(stateCode, mode).isEmpty()) {
                logger.info("  {} ensemble_data {} document already exists. Skipping.", stateUpper, mode);
                continue;
            }

            Document payloadDoc = new Document();
            for (String count : COUNTS) {
                for (String threshold : THRESHOLDS) {
                    String folder = "Complete_" + count + "_" + threshold;
                    String variantKey = count + "_" + threshold;
                    String path = "assets/" + stateCode + "/" + folder
                                + "/NEW-" + stateUpper + "-Precinct-" + mode + "-Splits.json";
                    String json = loadJsonString(path);
                    payloadDoc.put(variantKey, Document.parse(json));
                }
            }

            ensembleDataRepository.save(new EnsembleDataDocument(stateCode, mode, payloadDoc));
            logger.info("  Seeded {} ensemble_data {} document", stateUpper, mode);
        }
    }

    private Document buildCompareRaceKeyedDoc(String base, String fileSuffix) throws IOException {
        Document raceKeyedDoc = new Document();
        for (String race : RACES) {
            raceKeyedDoc.put(race, Document.parse(loadJsonString(base + race + fileSuffix)));
        }
        return raceKeyedDoc;
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
            String stateInfoJson = loadJsonString(
                "assets/" + stateCode + "/" + stateCodeUpper + "-State-Info.json");
            if (stateInfoJson != null && !stateInfoJson.isEmpty()) {
                Document payloadDoc = new Document();
                payloadDoc.put("data", parseJsonAsArray(stateInfoJson));
                StateInfoDocument doc = new StateInfoDocument(stateCode, payloadDoc);
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
        String base = "assets/" + stateCode + "/" + stateCodeUpper + "-Polarization-" + race + "-";

        String harrisJson    = loadJsonString(base + "Harris-EI.json");
        String harrisKdeJson = loadJsonString(base + "Harris-KDE.json");
        String trumpJson     = loadJsonString(base + "Trump-EI.json");
        String trumpKdeJson  = loadJsonString(base + "Trump-KDE.json");

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
            String ginglesJson = loadJsonString(
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
