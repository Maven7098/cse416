package com.example.cse416_backend;

import tools.jackson.databind.node.ArrayNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RestController
public class Cse416Controller {

    // The Prepared DTO (Data Transfer Obj's)
    private final HomeDataService homeDataService;
    private final StateSummaryService stateSummaryService;
    private final StateHeatmapService stateHeatmapService;
    private final StatePolarizationService statePolarizationService;
    private final ProposedDataService proposedDataService;
    private final ProposedCompareService proposedCompareService;

    // Map the DTO (Objects)
    public Cse416Controller(HomeDataService homeDataService, StateSummaryService stateSummaryService,
        StateHeatmapService stateHeatmapService, StatePolarizationService statePolarizationService,
        ProposedDataService proposedDataService, ProposedCompareService proposedCompareService ){
        this.homeDataService = homeDataService;
        this.stateSummaryService = stateSummaryService;
        this.stateHeatmapService = stateHeatmapService;
        this.statePolarizationService = statePolarizationService;
        this.proposedDataService = proposedDataService;
        this.proposedCompareService = proposedCompareService;
    }

    // Get 2 GeoJSON for the Homepage
    // Satisfies GUI-1
    // Maps to / => /
    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<ArrayNode> getHomePage() throws IOException {
        return ResponseEntity.ok(homeDataService.getHomePayload());
    }

    // Get a State Package
    // Satisfies GUI-2, GUI-3, GUI-6, GUI-7
    // Consists of a GeoJSON (District for District Select, District data embedded in GeoJSON)
    // And a State Data (Right-hand side display)
    @GetMapping(value = "/district", produces = "application/json")
    public ResponseEntity<ArrayNode> getStateSummaryPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(stateSummaryService.getHomePayload(currentState));
    }

    // Get a Heatmap Package
    // Satisfies GUI-4, GUI-5
    // Consists of 2 GeoJSON (Precinct for Heatmap, Census Block for Heatmap)
    @GetMapping(value = "/heatmap", produces = "application/json")
    public ResponseEntity<ArrayNode> getStateHeatmapPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(stateHeatmapService.getHomePayload(currentState));
    }

    // Get mapping for Gingles
    // Get Package for EI
    // Satisfies GUI-9, GUI-10, GUI-11, GUI-12, GUI-13, GUI-14, GUI-15
    // Consists of 1 GeoJSON object (Precinct for Heatmap)
    // And 3 Chart JSON Data (Gingles, EI Distribution, EI KDE)
    @GetMapping(value = "/polarization", produces = "application/json")
    public ResponseEntity<ArrayNode> getStatePolarizationPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(statePolarizationService.getHomePayload(currentState));
    }

    // DTO for showing proposed map (for both VRA-compliant and Non-VRA-compliant)
    // Satisfies GUI-16, GUI-17, GUI-19
    // Consists of 1 GeoJSON object (District for proposed map)
    // And 2 Chart JSON Data (BarChart, Box&Whisker)
    @GetMapping(value = "/proposed", produces = "application/json")
    public ResponseEntity<ArrayNode> getProposedPack(
            @RequestParam String currentState,
            @RequestParam String currentMode,
            @RequestParam(defaultValue = "4096") String count,
            @RequestParam(defaultValue = "High") String threshold) throws IOException {
        return ResponseEntity.ok(proposedDataService.getHomePayload(currentState, currentMode, count, threshold));
    }

    // DTO for comparison
    // Satisfies GUI-20, GUI-21, GUI-22
    // Consists of Chart JSON Data (VRA Impact Threshold Table, Box and Whisker, Minority Effectiveness Histogram)
    @GetMapping(value = "/compare", produces = "application/json")
    public ResponseEntity<ArrayNode> getComparePack(
            @RequestParam String currentState,
            @RequestParam(defaultValue = "4096") String count,
            @RequestParam(defaultValue = "High") String threshold) throws IOException {
        return ResponseEntity.ok(proposedCompareService.getHomePayload(currentState, count, threshold));
    }
}