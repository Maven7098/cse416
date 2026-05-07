import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/StateInfo.css";
import State from "./State.jsx";
import District from "./District.jsx";
import Legend from "./MapLegend.jsx"

import axios from "axios";

function StateInfo({
  activeState,
  activeRace,
  currentMode,
  currentRace,
  latitude,
  longitude,
}) {
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [currentState, setCurrentState] = useState("");

  // Set District Info GeoJSON Data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/district?currentState=${activeState}`)
      .then((response) => {
        setDistrictGeoJsonData(response.data[0]);
        setCurrentState(response.data[1].data[0]);
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
    // If Active State changes, then also reset districtData
    setDistrictData("");
  }, [activeState]);

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

  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() =>
      mapRef.current?.invalidateSize(),
    );
    const container = document.getElementById("map-container-stateinfo");
    if (container) {
      resizeObserver.observe(container);
    }
  };
  const mapRef = useRef(null);

  function getWinner(d) {
    switch (d) {
      case "R":
        return "#ff0000";
      case "D":
        return "#0000ff";
    }
  }

  function districtWindow(feature) {
    return {
      color: getWinner(feature.properties.WINNER),
      fillColor: getWinner(feature.properties.WINNER),
      weight: 2,
      opacity: 1,
      fillOpacity: 0.3,
    };
  }

  function onEachFeature(feature, layer) {
    let closePopupTimeout;
    if (feature.properties) {
      const popup = layer.bindPopup(`District ${feature.properties.DISTRICT}`, {
        autoClose: false,
        closeButton: false,
      });
      // Handle popup interactions
      popup.on("popupopen", function () {
        const popupElement = document.querySelector(".leaflet-popup");
        if (popupElement) {
          popupElement.addEventListener("mouseenter", function () {
            clearTimeout(closePopupTimeout); // Cancel close when entering popup
          });
          popupElement.addEventListener("mouseleave", function () {
            layer.closePopup();
          });
        }
      });
    }
    // Send properties of the feature to Population.jsx
    layer.on("click", function (e) {
      setDistrictData(feature.properties);
      this.closePopup();
    });

    layer.on("mouseover", function (e) {
      layer.setStyle({ weight: 6 });
      clearTimeout(closePopupTimeout); // Cancel any pending close
      this.openPopup();
    });
    layer.on("mouseout", function (e) {
      layer.setStyle({ weight: 2 });
      // Delay close to allow transition to popup without it closing
      closePopupTimeout = setTimeout(() => {
        layer.closePopup();
      }, 150);
    });
  }

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

  const width = 820;
  const heightState = 500;
  const heightDistrict = 523;

  return (
    // Load the GeoJSON for the districting map
    // For StateInfo 1 only: StateInfo 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div>
      <div className="leaflet-containerset">
        <div className="leaflet-container-big">
          {currentMode == "District" ? <h3>Select District</h3> : <h3>{currentRace} {currentMode} Heatmap</h3>}
          <MapContainer
            center={[latitude, longitude]}
            key={JSON.stringify(districtGeoJsonData)}
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
            {currentMode == "District" && <GeoJSON
              data={districtGeoJsonData}
              style={districtWindow}
              onEachFeature={onEachFeature}
              key={JSON.stringify(districtGeoJsonData)}
            /> }
            {currentMode == "Precinct" &&
              <>
                <Legend grades={grades} colors={colors} title={currentRace} />
                <GeoJSON
                  data={precinctGeoJsonData}
                  style={precinctHeatmap}
                  key={JSON.stringify(precinctGeoJsonData)}
                />
              </>
            }
            { currentMode == "Census Block" &&
              <>
                <Legend grades={grades} colors={colors} title={currentRace} />
                <GeoJSON
                  data={censusBlockGeoJsonData}
                  style={precinctHeatmap}
                  key={JSON.stringify(censusBlockGeoJsonData)}
                />
              </>
            }
            
          </MapContainer>
        </div>
        <div className="leaflet-container-big">
          {/* TODO Today: Use State Data if districtData is empty */}
          {districtData ? (
            <>
              <button
                className="go-back-btn"
                onClick={() => setDistrictData("")}
              >
                Go Back to State Information
              </button>
              <District
                districtData={districtData}
                activeRace={activeRace}
                currentRace={currentRace}
                width={width}
                height={heightDistrict}
              />
            </>
          ) : (
            <>
              <State
                activeState={currentState}
                activeRace={activeRace}
                currentRace={currentRace}
                width={width}
                height={heightState}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateInfo;
