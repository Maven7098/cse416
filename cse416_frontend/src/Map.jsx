import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import Population from './Population.jsx';

// Data to be imported from the server
import axios from 'axios';

function Map({activeState}){
  const [geojsonData, setgeojsonData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [districtData, setDistrictData] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/api/${activeState}/geojson`)
      .then(response => {setgeojsonData(response.data[0]); setLatitude(response.data[1]); setLongitude(response.data[2])})
      .catch(error => console.log(error.response.data))
    }, [activeState]);

    // console.log(geojsonData)

  // Also what should I receive from the server?
  // - Should the coordinates be downloaded from the server or hard-coded?
  // Data... What other data? (${activeState}/data)
  // - Party Splits (${activeState}/data/split)
  // - (${activeState}/data/)
  // -

  function getColor(d) {
    return d > 1000000 ? '#800026' :
           d > 500000  ? '#BD0026' :
           d > 200000  ? '#E31A1C' :
           d > 100000  ? '#FC4E2A' :
           d > 50000   ? '#FD8D3C' :
           d > 20000   ? '#FEB24C' :
           d > 10000   ? '#FED976' :
                      '#FFEDA0';
  }
  function getWinner(d) {
    switch (d) {
            case 'R': return "#ff0000";
            case 'D': return "#0000ff";
    }
  }

// On click, show district number

function style(feature) {
    // Need to find data on which President won which district
    // No third party won any district in Georgia or Iowa, so I only keep 2 values
    
    return {
        // property type should be chosen later on (after graph rendering is done)
        fillColor: getColor(feature.properties.BLACK),
        color: getWinner(feature.properties.WINNER),
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
    };
}

function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(feature.properties.DISTRICT);
    }
    // Send properties of the feature to Population.jsx
    layer.on("click", (e) => {
      handleClick(e, layer);
      setDistrictData(feature.properties);
    });
}
function handleClick(event, layer) {
  const bounds = layer.get
  // Send properties of tBounds();
  // console.log(bounds);
}


  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className='leaflet-container-big'>
        <h1>Select District</h1>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(geojsonData)} zoom={7} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} key={JSON.stringify(geojsonData)}/>
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
      <h1>District Information</h1>
        <Population districtData={districtData} />
      </div>
    </div>
  );
};

export default Map;