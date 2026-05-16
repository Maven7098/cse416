import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";
import "../CSS/mpld3.css";
import Legend from "./MapLegend.jsx";

import Mpld3Chart from "../Chart/Mpld3Chart.jsx";

function EIMap({
  precinctGeoJsonData,
  currentMode,
  eiData,
  activeRace,
  currentRace,
  latitude,
  longitude,
}) {
  if(eiData == []){
    return <p>Nothing to see here...</p>
  }

  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() =>
      mapRef.current?.invalidateSize(),
    );
    const container = document.getElementById("map-container-precinct");
    if (container) {
      resizeObserver.observe(container);
    }
  };
  const mapRef = useRef(null);

  const [currentEiData, setCurrentEiData] = useState("");
  const [currentEiKdeData, setCurrentEiKdeData] = useState("");
  const [currentOverlap, setCurrentOverlap] = useState("");
  
  useEffect(() => {
    switch (activeRace) {
    case "HISPANIC":
      switch(currentMode){
        case "D":
          setCurrentEiData(eiData.Hispanic.Harris.chart)
          setCurrentEiKdeData(eiData.Hispanic.Harris.kde)
          setCurrentOverlap(eiData.Hispanic.Harris.overlap.overlap)
          break;
        case "R":
          setCurrentEiData(eiData.Hispanic.Trump.chart)
          setCurrentEiKdeData(eiData.Hispanic.Trump.kde)
          setCurrentOverlap(eiData.Hispanic.Trump.overlap.overlap)
          break;
      }
      break;
    case "BLACK":
      switch(currentMode){
        case "D":
          setCurrentEiData(eiData.Black.Harris.chart)
          setCurrentEiKdeData(eiData.Black.Harris.kde)
          setCurrentOverlap(eiData.Black.Harris.overlap.overlap)
          break;
        case "R":
          setCurrentEiData(eiData.Black.Trump.chart)
          setCurrentEiKdeData(eiData.Black.Trump.kde)
          setCurrentOverlap(eiData.Black.Trump.overlap.overlap)
          break;
      }
      break;
    case "ASIAN":
      switch(currentMode){
        case "D":
          setCurrentEiData(eiData.Asian.Harris.chart)
          setCurrentEiKdeData(eiData.Asian.Harris.kde)
          setCurrentOverlap(eiData.Asian.Harris.overlap.overlap)
          break;
        case "R":
          setCurrentEiData(eiData.Asian.Trump.chart)
          setCurrentEiKdeData(eiData.Asian.Trump.kde)
          setCurrentOverlap(eiData.Asian.Trump.overlap.overlap)
          break;
      }
      case "WHITE":
      switch(currentMode){
        case "D":
          setCurrentEiData(eiData.White.Harris.chart)
          setCurrentEiKdeData(eiData.White.Harris.kde)
          setCurrentOverlap(eiData.White.Harris.overlap.overlap)
          break;
        case "R":
          setCurrentEiData(eiData.White.Trump.chart)
          setCurrentEiKdeData(eiData.White.Trump.kde)
          setCurrentOverlap(eiData.White.Trump.overlap.overlap)
          break;
      }
      break;
    }
  }, [activeRace, currentMode]);
  

  // GUI-14 (TODO Next)
  const grades = [0, 20, 40, 60, 80, 100];
  let colors = [];
  if (currentMode == "D") {
    colors = ["#EDA0FF", "#0000FF", "#0000D7", "#0000C6", "#0000B7", "#00009B"];
  } else {
    colors = ["#FFEDA0", "#FF0000", "#D70000", "#C60000", "#B70000", "#9B0000"];
  }

  // Grades of Blue (if Democrat is selected)
  // Grades of Red (if Republican is selected)
  function getColor(d, currentMode) {
    if (currentMode == "D") {
      return d > 1
        ? "#00009B"
        : d > 0.8
          ? "#0000B7"
          : d > 0.6
            ? "#0000C6"
            : d > 0.4
              ? "#0000D7"
              : d > 0.2
                ? "#0000FF"
                : "#EDA0FF";
    } else {
      return d > 1
        ? "#9B0000"
        : d > 0.8
          ? "#B70000"
          : d > 0.6
            ? "#C60000"
            : d > 0.4
              ? "#D70000"
              : d > 0.2
                ? "#FF0000"
                : "#FFEDA0";
    }
  }

  function getWinner(currentMode) {
    switch (currentMode) {
      case "R":
        return "#ff0000";
      case "D":
        return "#0000ff";
    }
  }

  // On click, show district number
  function style(feature) {
    // Need to find data on which President won which district
    // No third party won any district in Georgia or Iowa, so I only keep 2 values
    let mapRace;
    let mapRaceVote;

    switch (activeRace) {
      case "HISPANIC":
        mapRace = feature.properties.HISPANIC;
        if (currentMode == "D") {
          mapRaceVote = feature.properties.HISPANIC_DEM;
        } else {
          mapRaceVote = feature.properties.HISPANIC_REP;
        }
        break;
      case "BLACK":
        mapRace = feature.properties.BLACK;
        if (currentMode == "D") {
          mapRaceVote = feature.properties.BLACK_DEM;
        } else {
          mapRaceVote = feature.properties.BLACK_REP;
        }
        break;
      case "ASIAN":
        mapRace = feature.properties.ASIAN;
        if (currentMode == "D") {
          mapRaceVote = feature.properties.ASIAN_DEM;
        } else {
          mapRaceVote = feature.properties.ASIAN_REP;
        }
        break;
      case "WHITE":
        mapRace = feature.properties.WHITE;
        if (currentMode == "D") {
          mapRaceVote = feature.properties.WHITE_DEM;
        } else {
          mapRaceVote = feature.properties.WHITE_REP;
        }
        break;
    }

    return {
      // property type should be chosen later on (after graph rendering is done)
      fillColor: getColor(mapRaceVote / mapRace, currentMode),
      color: getWinner(currentMode),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7,
    };
  }

  const MyChart = () => {
    const svgRef = useRef();

    useEffect(() => {
      const svg = d3.select(svgRef.current);
      testEiData;
    }, []);

    return <svg ref={svgRef}></svg>;
  };

  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div>
      <div className="leaflet-containerset">
        <div className="leaflet-container-big">
          <h3>Voting Preference for {currentRace}</h3>
          <div className="map">
            <MapContainer
              center={[latitude, longitude]}
              key={JSON.stringify(precinctGeoJsonData)}
              zoom={7}
              className="leaflet-container"
              ref={mapRef}
              id="map-container-precinct"
              whenReady={() => resizeMap(mapRef)}
            >
              <Legend
                grades={grades}
                colors={colors}
                title={`${currentRace} Voting %`}
              />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON
                data={precinctGeoJsonData}
                style={style}
                key={JSON.stringify(precinctGeoJsonData)}
              />
            </MapContainer>
          </div>
        </div>
        <div className="leaflet-container-big">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3>Support for Candidate</h3>
            {/* EI Analysis */}
            <section>
              <h5>EI Analysis</h5>
              {currentEiData ? (
                <Mpld3Chart data={currentEiData} figId="ei-data" />
              ) : (
                <p>EI Analysis Data not available yet.</p>
              )}
            </section>

            {/* Kernel Data Results */}
            <section>
              <h5>EI KDE (Kernel Data) Results</h5>
              {currentEiKdeData ? (
                <Mpld3Chart data={currentEiKdeData} figId="ei-kde-data" />
              ) : (
                <p>EI KDE Data not available yet.</p>
              )}
            </section>
            <section>
              {currentRace != "White" ?
              <h5>{currentRace} Voting Overlap with Whites: {Number(currentOverlap).toFixed(5)}</h5> :
              <h5>{currentRace} Voting Overlap with Non-Whites: {Number(currentOverlap).toFixed(5)}</h5>
        }
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EIMap;
