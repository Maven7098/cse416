import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { useNavigate, Outlet } from 'react-router'
import axios from 'axios';
import './Home.css'

function Home() {
  // Get the image of Iowa and Georgia states from server
  const [iowa, setIowa] = useState("");
  const [georgia, setGeorgia] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/`)
      .then(response => {
        setIowa(response.data[0]);
        setGeorgia(response.data[1]);
        setPlaces(response);
      })
      .catch(error => console.log(error.response.data))
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
      if(feature.properties.NAME === "Iowa"){ navigate('/iowa') }
      if(feature.properties.NAME === "Georgia"){ navigate('/georgia') }
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
    <>
      <h1>Select a State</h1>
        <div className="leaflet-containerset">
          <div className='leaflet-container-big'>
            <MapContainer center={[39.8333,-98.5833]} key={JSON.stringify(places)}
            zoom={4} className="leaflet-container" ref={mapRef} id="map-container-district"
            whenReady={() => resizeMap(mapRef)}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON data={iowa} style={districtWindow} onEachFeature={onEachFeature} key={JSON.stringify(iowa)}>
                </GeoJSON>
              <GeoJSON data={georgia} style={districtWindow} onEachFeature={onEachFeature} key={JSON.stringify(georgia)}>
                </GeoJSON>
            </MapContainer>
          </div>
        </div>

        <Outlet />
    </>
  )
}

export default Home
