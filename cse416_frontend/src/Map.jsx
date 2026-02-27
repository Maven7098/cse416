import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import State from './State.jsx';
import Population from './Population.jsx';

import Legend from './MapLegend.jsx';
import axios from 'axios';

function Map({ activeState, activeRace, latitude, longitude }){
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [currentState, setCurrentState] = useState("");

  useEffect(() => {
      axios.get(`http://localhost:3000/api/${activeState}/district`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
            setCurrentState(response.data[1])})
      .catch(error => console.log(error.response.data))
      // If Active State changes, then also reset districtData
      setDistrictData("")
  }, [activeState]);

    const resizeMap = (mapRef) => {
      const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
      const container = document.getElementById('map-container-district')
      if (container) {
        resizeObserver.observe(container)
      }
    }
    const mapRef = useRef(null)

  function getColor(d) {
    return d > 1000000 ? '#800026' :
           d > 500000  ? '#BD0026' :
           d > 200000  ? '#E31A1C' :
           d > 100000  ? '#FC4E2A' :
           d > 20000   ? '#FD8D3C' :
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

  function style(feature) {
    // Need to find data on which President won which district
    // No third party won any district in Georgia or Iowa, so I only keep 2 values
    let mapRace;

    switch (activeRace) {
      case "HISPANIC":
        mapRace = feature.properties.HISPANIC;
        break;
      case "BLACK":
        mapRace = feature.properties.BLACK;
        break;
      case "ASIAN":
        mapRace = feature.properties.ASIAN;
        break;
    }
    
    return {
        // property type should be chosen later on (after graph rendering is done)
        fillColor: getColor(mapRace),
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

  const grades = [0, 20000, 100000, 200000, 500000, 1000000];
  const colors = ['#FFEDA0', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

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
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(districtGeoJsonData)}
        zoom={7} className="leaflet-container" ref={mapRef} id="map-container-district"
        whenReady={() => resizeMap(mapRef)}>
          <Legend grades={grades} colors={colors} title={currentRace}/>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={districtGeoJsonData} style={style} onEachFeature={onEachFeature} key={JSON.stringify(districtGeoJsonData)}/>
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