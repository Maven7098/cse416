import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import Legend from "./MapLegend.jsx";
import axios from "axios";

function StateHeatmap({
  activeState,
  currentMode,
  activeRace,
  currentRace,
  latitude,
  longitude,
}) {
  const [precinctGeoJsonData, setPrecinctGeoJsonData] = useState("");
  const [censusBlockGeoJsonData, setCensusBlockGeoJsonData] = useState("");

  // Set the Precinct and Census Block GeoJSON Data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/heatmap?currentState=${activeState}`)
      .then((response) => {
        const payload = Array.isArray(response.data) ? response.data : [];
        const normalized = Array.isArray(payload[0]) ? payload[0] : payload;
        setPrecinctGeoJsonData(
          normalized[0] && typeof normalized[0] === "object"
            ? normalized[0]
            : "",
        );
        setCensusBlockGeoJsonData(
          normalized[1] && typeof normalized[1] === "object"
            ? normalized[1]
            : "",
        );
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
  }, [activeState]);

  // This is to force the map to load upon first click
  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() =>
      mapRef.current?.invalidateSize(),
    );
    const container = document.getElementById("map-container-heatmap");
    if (container) {
      resizeObserver.observe(container);
    }
  };
  const mapRef = useRef(null);

  function getColor(d) {
    return d > 0.9
      ? "#800026"
      : d > 0.6
        ? "#BD0026"
        : d > 0.4
          ? "#E31A1C"
          : d > 0.2
            ? "#FC4E2A"
            : d > 0.1
              ? "#FD8D3C"
              : "#FFEDA0";
  }

  function precinctHeatmap(feature) {
    // Need to find data on which President won which district
    // No third party won any district in Georgia or Iowa, so I only keep 2 values
    let mapRace;

    switch (activeRace) {
      case "HISPANIC":
        mapRace = feature.properties.HISPANIC / feature.properties.TOTAL;
        break;
      case "BLACK":
        mapRace = feature.properties.BLACK / feature.properties.TOTAL;
        break;
      case "ASIAN":
        mapRace = feature.properties.ASIAN / feature.properties.TOTAL;
        break;
    }

    return {
      // property type should be chosen later on (after graph rendering is done)
      fillColor: getColor(mapRace),
      opacity: 0,
      fillOpacity: 0.7,
    };
  }

  const grades = ["0%", "10%", "20%", "40%", "60%", "90%"];
  const colors = [
    "#FFEDA0",
    "#FD8D3C",
    "#FC4E2A",
    "#E31A1C",
    "#BD0026",
    "#800026",
  ];

  return (
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h3>
          {currentMode}-level {currentRace} Population
        </h3>
        <MapContainer
          center={[latitude, longitude]}
          key={JSON.stringify(precinctGeoJsonData)}
          zoom={7}
          className="leaflet-container"
          ref={mapRef}
          id="map-container-stateinfo"
          whenReady={() => resizeMap(mapRef)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Legend grades={grades} colors={colors} title={currentRace} />
          {currentMode == "Precinct" ? (
            <GeoJSON
              data={precinctGeoJsonData}
              style={precinctHeatmap}
              key={JSON.stringify(precinctGeoJsonData)}
            />
          ) : (
            <GeoJSON
              data={censusBlockGeoJsonData}
              style={precinctHeatmap}
              key={JSON.stringify(censusBlockGeoJsonData)}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default StateHeatmap;
