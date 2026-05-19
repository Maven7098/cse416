import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate, Outlet } from "react-router";
import axios from "axios";
import * as topojson from "topojson-client";
import "leaflet/dist/leaflet.css";
import "./CSS/StateInfo.css";
import "./CSS/Home.css";

// Helper function to decode TopoJSON if necessary
const ensureGeoJSON = (data) => {
  if (data && data.type === "Topology") {
    const firstObjectName = Object.keys(data.objects)[0];
    return topojson.feature(data, data.objects[firstObjectName]);
  }
  return data;
};

function Home() {
  // Get the image of Iowa and Georgia states from server
  const [iowa, setIowa] = useState("");
  const [georgia, setGeorgia] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/`)
      .then((response) => {
        setIowa(ensureGeoJSON(response.data[0]));
        setGeorgia(ensureGeoJSON(response.data[1]));
      })
      .catch((error) => console.log(error.response?.data ?? error.message));
  }, []);

  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() =>
      mapRef.current?.invalidateSize(),
    );
    const container = document.getElementById("map-container-district");
    if (container) {
      resizeObserver.observe(container);
    }
  };
  const mapRef = useRef(null);

  function districtWindow() {
    return {
      fillColor: "#FFEDA0",
      color: "#000000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    };
  }

  function onEachFeature(feature, layer) {
    if (feature.properties) {
      layer.bindPopup(feature.properties.NAME);
    }

    layer.on("click", function () {
      if (feature.properties.NAME === "Iowa - Non Pre-Clearance State") {
        navigate("/iowa");
      }
      if (feature.properties.NAME === "Georgia - Pre-Clearance State") {
        navigate("/georgia");
      }
    });

    layer.on("mouseover", function () {
      layer.setStyle({ weight: 6 });
      this.openPopup();
    });
    layer.on("mouseout", function () {
      layer.setStyle({ weight: 2 });
      this.closePopup();
    });
  }

  let navigate = useNavigate();

  return (
    <div className="home-page-wrapper">
      <h1>Select a State</h1>
      <div className="home-map-container">
        <div className="leaflet-containerset">
          <div className="leaflet-container-big">
            <MapContainer
              center={[39.8333, -98.5833]}
              zoom={4}
              className="leaflet-container"
              ref={mapRef}
              id="map-container-district"
              whenReady={() => resizeMap(mapRef)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {iowa && (
                <GeoJSON
                  data={iowa}
                  style={districtWindow}
                  onEachFeature={onEachFeature}
                  key="iowa-geojson"
                />
              )}
              {georgia && (
                <GeoJSON
                  data={georgia}
                  style={districtWindow}
                  onEachFeature={onEachFeature}
                  key="georgia-geojson"
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Home;
