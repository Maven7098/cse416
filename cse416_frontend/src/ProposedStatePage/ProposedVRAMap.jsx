import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/StateInfo.css';
import axios from 'axios';

function ProposedVRAMap({ activeState, activeRace, activeMap, latitude, longitude }){
    const resizeMap = (mapRef) => {
      const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
      const container = document.getElementById(`/map-container-district-${activeMap}`)
      if (container) {
        resizeObserver.observe(container)
      }
    }
    const mapRef = useRef(null)


  // "Softening" the interface - No longer using all caps
  let currentRace = "Black / African American"
  switch (activeRace) {
      case "HISPANIC":
        currentRace = "Hispanic / Latino<br /> Population"
        break;
      case "BLACK":
        currentRace = "Black / African American<br /> Population"
        break;
      case "ASIAN":
        currentRace = "Asian / Asian American<br /> Population"
        break;
    }

    function districtWindow(){
    return {
        fillColor: '#FFEDA0',
        color: '#800026',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.5
    };
  }

    const width = 900;
    const proposedHeight = 320;

  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <>
    <div className="leaflet-containerset">
        {/* GUI-19 - Display an interesting district plan */}
      <div className='leaflet-container-big'>
        <h3>Proposed District Map</h3>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(activeMap)}
        zoom={7} className="leaflet-container" ref={mapRef} id={`map-container-district-${activeMap}`}
        whenReady={() => resizeMap(mapRef)}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* <GeoJSON data={activeMap} style={districtWindow} key={JSON.stringify(activeMap)}/> */}
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
        {/* Description for each GeoJSON */}
      </div>
    </div>
    </>
  );
};

export default ProposedVRAMap;