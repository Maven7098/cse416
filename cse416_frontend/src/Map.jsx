import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Data to be imported from the server
import axios from 'axios';

function Map({activeState}){
  const [geojsonData, setgeojsonData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/api/${activeState}/geojson`)
      .then(response => {setgeojsonData(response.data[0]); setLatitude(response.data[1]); setLongitude(response.data[2])})
      .catch(error => console.log(error.response.data))
    }, [activeState]);

    console.log(geojsonData)

  // Also what should I receive from the server?
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