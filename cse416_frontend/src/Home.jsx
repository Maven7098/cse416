import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate, Outlet } from 'react-router'
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './CSS/StateInfo.css';
import './CSS/Home.css'

function Home() {
  // Get the image of Iowa and Georgia states from server
  const [iowa, setIowa] = useState("");
  const [georgia, setGeorgia] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/`)
      .then(response => {
        setIowa(response.data[0]);
        setGeorgia(response.data[1]);
        setPlaces(response);
      })
      .catch(error => console.log(error.response?.data ?? error.message))
    }, []);
  
  const resizeMap = (mapRef) => {
    const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
    const container = document.getElementById('map-container-district')
    if (container) {
      resizeObserver.observe(container)
    }
  }
  const mapRef = useRef(null)

  function districtWindow(){
    return {
        fillColor: '#FFEDA0',
        color: '#000000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    };
  }

  function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(feature.properties.NAME);
    }

    layer.on('click', function (e) {
      if(feature.properties.NAME === "Iowa - Non Pre-Clearance State"){ navigate('/iowa') }
      if(feature.properties.NAME === "Georgia - Pre-Clearance State"){ navigate('/georgia') }
    });

    layer.on('mouseover', function (e) {
        layer.setStyle({weight:6})
        this.openPopup();
    });
    layer.on('mouseout', function (e) {
        layer.setStyle({weight:2})
        this.closePopup();
    });
  }

  let navigate = useNavigate();

  return (
    <div className="home-page-wrapper">
      <h1>Select a State</h1>
      <div className="home-map-container">
        <div className="leaflet-containerset">
          <div className='leaflet-container-big'>
            <MapContainer center={[39.8333,-98.5833]} key={JSON.stringify(places)}
            zoom={4} className="leaflet-container" ref={mapRef} id="map-container-district"
            whenReady={() => resizeMap(mapRef)}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON data={iowa} style={districtWindow} onEachFeature={onEachFeature} key="iowa-geojson">
                </GeoJSON>
              <GeoJSON data={georgia} style={districtWindow} onEachFeature={onEachFeature} key="georgia-geojson">
                </GeoJSON>
            </MapContainer>
          </div>
        </div>
      </div>

        <Outlet />
    </div>
  )
}

export default Home
