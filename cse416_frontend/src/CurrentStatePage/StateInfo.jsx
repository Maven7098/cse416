import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/StateInfo.css';
import State from './State.jsx';
import District from './District.jsx';

import axios from 'axios';

function StateInfo({ activeState, activeRace, currentRace, latitude, longitude }){
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [currentState, setCurrentState] = useState("");

  useEffect(() => {
      axios.get(`http://localhost:8080/district?currentState=${activeState}`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
            setCurrentState(response.data[1])})
      .catch(error => console.log(error.response?.data ?? error.message))
      // If Active State changes, then also reset districtData
      setDistrictData("")
  }, [activeState]);

  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
    const container = document.getElementById('map-container-stateinfo')
    if (container) {
      resizeObserver.observe(container)
    }
  }
  const mapRef = useRef(null)

  function getWinner(d) {
    switch (d) {
            case 'R': return "#ff0000";
            case 'D': return "#0000ff";
    }
  }

  function districtWindow(feature){
    return {
        color: getWinner(feature.properties.WINNER),
        fillColor: getWinner(feature.properties.WINNER),
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3
    };
  }

  function onEachFeature(feature, layer) {
    let closePopupTimeout;
    if (feature.properties) {
        const popup = layer.bindPopup(`District ${feature.properties.DISTRICT}`, { autoClose: false, closeButton: false });
        // Handle popup interactions
        popup.on('popupopen', function() {
          const popupElement = document.querySelector('.leaflet-popup');
          if (popupElement) {
            popupElement.addEventListener('mouseenter', function() {
              clearTimeout(closePopupTimeout); // Cancel close when entering popup
            });
            popupElement.addEventListener('mouseleave', function() {
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

    layer.on('mouseover', function (e) {
        layer.setStyle({weight:6})
        clearTimeout(closePopupTimeout); // Cancel any pending close
        this.openPopup();
    });
    layer.on('mouseout', function (e) {
        layer.setStyle({weight:2})
        // Delay close to allow transition to popup without it closing
        closePopupTimeout = setTimeout(() => {
            layer.closePopup();
        }, 150);
    });
  }

  const width = 820;
  const heightState = 650;
  const heightDistrict = 595;

  return (
    // Load the GeoJSON for the districting map
    // For StateInfo 1 only: StateInfo 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div>
      <div className="leaflet-containerset">
        <div className='leaflet-container-big'>
          <h3>Select District</h3>
          <MapContainer center={[latitude, longitude]} key={JSON.stringify(districtGeoJsonData)}
          zoom={7} className="leaflet-container" ref={mapRef} id="map-container-stateinfo"
          whenReady={() => resizeMap(mapRef)}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
              <GeoJSON data={districtGeoJsonData} style={districtWindow} onEachFeature={onEachFeature} key={JSON.stringify(districtGeoJsonData)}/>
          </MapContainer>
        </div>
        <div className='leaflet-container-big'>
          {/* TODO Today: Use State Data if districtData is empty */}
          {districtData ? (<>
          <button className="go-back-btn" onClick={() => setDistrictData("")}>Go Back to State Information</button>
          <District districtData={districtData} activeRace={activeRace} currentRace={currentRace} width={width} height={heightDistrict} />
          </>)
          : (<>
            <State activeState={currentState} currentRace={currentRace} width={width} height={heightState} />
          </>)
          }
          
        </div>
      </div>
    </div>
  );
};

export default StateInfo;