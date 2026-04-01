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

    public DataSeedService(HomeGeoJsonRepository homeGeoJsonRepository) {
        this.homeGeoJsonRepository = homeGeoJsonRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabase() {
        logger.info("===== Starting MongoDB Database Seeding =====");
        
        seedHomeGeoJsonData();
        
        // Add more seeding methods here as needed:
        // seedEnsembleData();
        // seedEIData();
        // etc.
        
        logger.info("===== Database Seeding Completed =====");
    }

    private void seedHomeGeoJsonData() {
        try {
            logger.info("Seeding home_geojson collection...");

            if (homeGeoJsonRepository.findByStateCode("ia").isEmpty()) {
                String iaJsonString = loadJsonStringFromClasspath("assets/ia/IA-State.json");
                if (iaJsonString != null && !iaJsonString.isEmpty()) {
                    HomeGeoJsonDocument iaDoc = new HomeGeoJsonDocument();
                    iaDoc.setStateCode("ia");
                    iaDoc.setPayload(Document.parse(iaJsonString));
                    homeGeoJsonRepository.save(iaDoc);
                    logger.info("  ✓ Seeded IA home_geojson document");
                }
            } else {
                logger.info("  ✓ IA home_geojson document already exists. Skipping.");
            }

            if (homeGeoJsonRepository.findByStateCode("ga").isEmpty()) {
                String gaJsonString = loadJsonStringFromClasspath("assets/ga/GA-State.json");
                if (gaJsonString != null && !gaJsonString.isEmpty()) {
                    HomeGeoJsonDocument gaDoc = new HomeGeoJsonDocument();
                    gaDoc.setStateCode("ga");
                    gaDoc.setPayload(Document.parse(gaJsonString));
                    homeGeoJsonRepository.save(gaDoc);
                    logger.info("  ✓ Seeded GA home_geojson document");
                }
            } else {
                logger.info("  ✓ GA home_geojson document already exists. Skipping.");
            }

            logger.info("✓ home_geojson seeding completed successfully");
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
    
    /**
     * Example of how to seed additional collections:
     * Uncomment and call from seedDatabase() when ready
     
    private void seedEnsembleData() throws IOException {
        try {
            logger.info("Seeding ensemble collection... (TODO)");
            // Example structure:
            // 1. Load IA-Ensemble-Data-VRA.json
            // 2. Create EnsembleDocument with stateCode, mode, and payload
            // 3. Save to ensembleRepository
        } catch (IOException e) {
            logger.error("Error seeding ensemble data", e);
        }
    }
    */
}
