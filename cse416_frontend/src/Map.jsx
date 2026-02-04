import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

const Map = ({geojsonData}) => {
  return (
    // TODO: Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    <div className="leaflet-containerset">
      <MapContainer center={[33.2478, -83.4411]} zoom={13} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={geojsonData} />
      </MapContainer>
      <MapContainer center={[33.2478, -83.4411]} zoom={13} className="leaflet-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default Map;