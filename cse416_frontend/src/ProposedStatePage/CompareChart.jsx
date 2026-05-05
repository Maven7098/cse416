import { useEffect, useState } from "react";
import VraImpactThresholdTable from "./VraImpactThresholdTable.jsx";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";
import axios from "axios";
import Mpld3Chart from "../Chart/Mpld3Chart.jsx";

function CompareChart({ currentRace, currentVraImpactThresholdData, currentCompareBoxandWhiskerData, currentCompareHistogramData }) {

  return (
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} VRA Impact Threshold Table
        </h3>
        <VraImpactThresholdTable data={currentVraImpactThresholdData} />
      </div>
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} distribution in districts
        </h3>
        <h5>Box and Whisker Data</h5>
        {currentCompareBoxandWhiskerData && (
          <Mpld3Chart data={currentCompareBoxandWhiskerData} figId="box-whisker" />
        )}
      </div>
      <div className="leaflet-container-big">
        <h3 style={{ marginBottom: "0.5rem" }}>
          {currentRace} distribution in districts
        </h3>
        <h5>Compare Histogram</h5>
        {currentCompareHistogramData && (
          <Mpld3Chart data={currentCompareHistogramData} figId="compare-histogram" />
        )}
      </div>
    </div>
  );
}

export default CompareChart;
