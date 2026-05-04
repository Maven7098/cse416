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

    // The prepared DTOs are injected as services into the controller.
    private final HomeDataService homeDataService;
    private final StateSummaryService stateSummaryService;
    private final StateHeatmapService stateHeatmapService;
    private final StatePolarizationService statePolarizationService;
    private final ProposedDataService proposedDataService;
    private final ProposedCompareService proposedCompareService;

    /**
     * Constructor-injected services (Spring handles dependency injection automatically).
     * Map the DTOs to the controller
     *
     * @param homeDataService           for homepage GeoJSON payloads
     * @param stateSummaryService       for district-level state summary data
     * @param stateHeatmapService       for precinct/census-block heatmap GeoJSON
     * @param statePolarizationService  for Gingles and EI analysis data
     * @param proposedDataService       for proposed redistricting map data
     * @param proposedCompareService    for cross-plan comparison chart data
     */
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

    /**
     * GET /
     *
     * Returns 2 GeoJSON objects needed to render the homepage state-selection map.
     * Satisfies GUI-1.
     * Maps to / => /
     *
     * @return ArrayNode containing the two home-page GeoJSON objects
     * @throws IOException if the underlying GeoJSON files cannot be read
     */
    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<ArrayNode> getHomePage() throws IOException {
        return ResponseEntity.ok(homeDataService.getHomePayload());
    }

    /**
     * GET /district?currentState={state}
     *
     * Returns a State Package for the selected state.
     * Satisfies GUI-2, GUI-3, GUI-6, GUI-7.
     * Consists of a GeoJSON (District for District Select, District data embedded in GeoJSON)
     * and a State Data object (Right-hand side display).
     *
     * @param currentState two-letter state abbreviation ("GA" or "IA")
     * @return ArrayNode containing the district GeoJSON and state summary data
     * @throws IOException if the underlying data files cannot be read
     */
    @GetMapping(value = "/district", produces = "application/json")
    public ResponseEntity<ArrayNode> getStateSummaryPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(stateSummaryService.getHomePayload(currentState));
    }

    /**
     * GET /heatmap?currentState={state}
     *
     * Returns a Heatmap Package for the selected state.
     * Satisfies GUI-4, GUI-5.
     * Consists of 2 GeoJSON objects: one at the precinct level and one at the census-block level,
     * both used to render demographic heatmap layers on the map.
     *
     * @param currentState two-letter state abbreviation ("GA" or "IA")
     * @return ArrayNode containing the precinct GeoJSON and census-block GeoJSON
     * @throws IOException if the underlying GeoJSON files cannot be read
     */
    @GetMapping(value = "/heatmap", produces = "application/json")
    public ResponseEntity<ArrayNode> getStateHeatmapPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(stateHeatmapService.getHomePayload(currentState));
    }

    /**
     * GET /polarization?currentState={state}
     *
     * Returns a Polarization Package combining Gingles analysis and Ecological Inference (EI) data.
     * Get mapping for Gingles / Get Package for EI.
     * Satisfies GUI-9, GUI-10, GUI-11, GUI-12, GUI-13, GUI-14, GUI-15.
     * Consists of 1 GeoJSON object (Precinct for Heatmap) and 3 Chart JSON data sets
     * (Gingles scatter, EI Distribution, EI KDE).
     *
     * @param currentState two-letter state abbreviation ("GA" or "IA")
     * @return ArrayNode containing the precinct GeoJSON and three chart datasets
     * @throws IOException if the underlying data files cannot be read
     */
    @GetMapping(value = "/polarization", produces = "application/json")
    public ResponseEntity<ArrayNode> getStatePolarizationPack(@RequestParam String currentState) throws IOException {
        return ResponseEntity.ok(statePolarizationService.getHomePayload(currentState));
    }

    /**
     * GET /proposed?currentState={state}&currentMode={mode}&count={count}&threshold={threshold}
     *
     * Returns a Proposed Map Package for both VRA-compliant and Non-VRA-compliant ensemble runs.
     * DTO for showing proposed map (for both VRA-compliant and Non-VRA-compliant).
     * Satisfies GUI-16, GUI-17, GUI-19.
     * Consists of 1 GeoJSON object (District boundaries for the proposed map) and 2 chart datasets
     * (BarChart and Box & Whisker).
     *
     * @param currentState two-letter state abbreviation ("GA" or "IA")
     * @param currentMode  ensemble mode identifier ("SMD" or "MMD")
     * @param count        number of ensemble plans to consider; defaults to "4096"
     * @param threshold    VRA sensitivity threshold ("High", "Medium", "Low"); Defaults to "High"
     * @return ArrayNode containing the proposed district GeoJSON and chart data
     * @throws IOException if the underlying data files cannot be read
     */
    @GetMapping(value = "/proposed", produces = "application/json")
    public ResponseEntity<ArrayNode> getProposedPack(
            @RequestParam String currentState,
            @RequestParam String currentMode,
            @RequestParam(defaultValue = "4096") String count,
            @RequestParam(defaultValue = "High") String threshold) throws IOException {
        return ResponseEntity.ok(proposedDataService.getHomePayload(currentState, currentMode, count, threshold));
    }

    /**
     * GET /compare?currentState={state}&count={count}&threshold={threshold}
     *
     * Returns a Comparison Package used to contrast VRA-compliant vs. standard ensemble plans.
     * DTO for comparison.
     * Satisfies GUI-20, GUI-21, GUI-22.
     * Consists of Chart JSON Data: VRA Impact Threshold Table, Box and Whisker plot,
     * and Minority Effectiveness Histogram.
     *
     * @param currentState two-letter state abbreviation ("GA" or "IA")
     * @param count        number of ensemble plans to consider; defaults to "4096"
     * @param threshold    VRA sensitivity threshold ("High", "Medium", "Low"); defaults to "High"
     * @return ArrayNode containing the three comparison chart datasets
     * @throws IOException if the underlying data files cannot be read
     */
    @GetMapping(value = "/compare", produces = "application/json")
    public ResponseEntity<ArrayNode> getComparePack(
            @RequestParam String currentState,
            @RequestParam(defaultValue = "4096") String count,
            @RequestParam(defaultValue = "High") String threshold) throws IOException {
        return ResponseEntity.ok(proposedCompareService.getHomePayload(currentState, count, threshold));
    }
}