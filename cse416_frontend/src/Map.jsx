import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import State from './State.jsx';
import Population from './Population.jsx';

// Data to be imported from the server
import axios from 'axios';

function Map({activeState}){
  const [geojsonData, setgeojsonData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [currentState, setCurrentState] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/api/${activeState}/geojson`)
      .then(response => {setgeojsonData(response.data[0]);
        setLatitude(response.data[1]);
        setLongitude(response.data[2]);
        setCurrentState(response.data[3])})
      .catch(error => console.log(error.response.data))
    // If Active State changes, then also reset districtData
      setDistrictData("")
    }, [activeState]);

    const resizeMap = (mapRef) => {
      const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
      const container = document.getElementById('map-container')
      if (container) {
        resizeObserver.observe(container)
      }
    }
    const mapRef = useRef(null)


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

  var highlightStyle = {
    weight: 6
  };


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

    layer.on("mouseover", (e) => {
      layer.setStyle(highlightStyle);
        layer.on("mouseout", (e) => {
        // Start by reverting the style back
        layer.setStyle({weight: 2});
      });
    })
}
function handleClick(event, layer) {
  const bounds = layer.get
  // Send properties of tBounds();
  // console.log(bounds);
}

const width = 960;
const heightPop = 280;
const heightState = 300;

  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <>
    <div className="leaflet-containerset">
      <div className='leaflet-container-big'>
        <h1>Select District</h1>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(geojsonData)}
        zoom={7} className="leaflet-container" ref={mapRef} id="map-container"
        whenReady={() => resizeMap(mapRef)}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} key={JSON.stringify(geojsonData)}/>
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
        {/* TODO Today: Use State Data if districtData is empty */}
        {districtData ? (<>
        <button onClick={() => setDistrictData("")}>Go Back to State Information</button>
         <h1>District Information</h1>
         <Population districtData={districtData} width={width} height={heightPop} />
        </>)
         : (<>
          <h1>State Information</h1>
          <State activeState={currentState} width={width} height={heightState} />
        </>)
        }
        
      </div>
    </div>
    </>
  );
};

export default Map;