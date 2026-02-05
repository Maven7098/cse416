import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import geojsonDataIA from './IA-Congress-2022-shape.json'
import geojsonDataGA from './GA-Congress-2023-shape.json'

function Map({activeState}){
  let latitude, longitude, geojsonData;
  print(activeState)
  // Iowa (IA) - Non-Preclearance
    if(activeState == "ia"){
      latitude=41.8780;
      longitude=-93.0977;
      geojsonData=geojsonDataIA
    }
    // Georgia (GA) - Preclearance
    else if(activeState == "ga"){
      latitude=33.2478;
      longitude=-83.4411;
      geojsonData=geojsonDataGA
    }
    // What else?

  return (
    // TODO: Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    <div className="leaflet-containerset">
      <div className='leaflet-container-big'>
        <h1>Voting Rights Act</h1>
        <MapContainer center={[latitude, longitude]} zoom={7} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={geojsonData} />
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
      <h1>Race Blind Voting</h1>
        <MapContainer center={[latitude, longitude]} zoom={7} className="leaflet-container">
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