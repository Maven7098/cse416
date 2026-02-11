import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
// Those are to be imported from the server for the next part
import axios from 'axios';
// import geojsonDataIA from './assets/IA-Congress-2022-shape.json'
// import geojsonDataGA from './assets/GA-Congress-2023-shape.json'

function Map({activeState}){
  // Receive GeoJSON with this useEffect()
  // Should I set activeState with this as well, or just the GeoJSON?
  // Also, how to prevent "redownload" of GeoJSON?

  let latitude, longitude;
  // Iowa (IA) - Non-Preclearance
  if(activeState == "ia"){
    latitude=41.8780;
    longitude=-93.0977;
  }
  // Georgia (GA) - Preclearance
  else if(activeState == "ga"){
    latitude=33.2478;
    longitude=-83.4411;
  }
  
  const [geojsonData, setgeojsonData] = useState("");

  console.log(activeState);
  useEffect(() => {
    axios.get(`https://localhost:3000/api/${activeState}/geojson`)
      .then(response => setgeojsonData(response.data))
      .catch(error => console.log(error.response.data))
    }, []);

  // Also what should I receive from the server?
  // GeoJSON (${activeState}/geojson)
  // Coordinates (Latitude and Longitude) of the state? ()
  // - Should the coordinates be downloaded from the server or hard-coded?
  // Data... What other data? (${activeState}/data)
  // - Party Splits (${activeState}/data/split)
  // - (${activeState}/data/)
  // -

  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div className="leaflet-containerset">
      <div className='leaflet-container-big'>
        <h1>Voting Rights Act</h1>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(geojsonData)} zoom={7} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={geojsonData} key={JSON.stringify(geojsonData)}/>
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
      <h1>Race Blind Voting</h1>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(geojsonData)} zoom={7} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;