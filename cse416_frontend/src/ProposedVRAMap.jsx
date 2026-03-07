import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import EnsembleSplits from './EnsembleSplits.jsx'
import BoxandWhiskerChart from './BoxandWhiskerChart.jsx'
import axios from 'axios';

function ProposedVRAMap({ activeState, activeRace, mode, latitude, longitude }){
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [ensembleSplitData, setEnsembleSplitData] = useState([]);
  const [boxandWhiskerData, setBoxandWhiskerData] = useState([]);
  const [circleData, setCircleData] = useState([]);

    // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
      axios.get(`http://localhost:8080/${activeState}/district-${mode}`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
            setEnsembleSplitData(response.data[1])})
      .catch(error => console.log(error.response.data))
      // If Active State changes, then also reset districtData
      setDistrictGeoJsonData("")
  }, [activeState, mode, activeRace]);
  useEffect(() => {
      axios.get(`http://localhost:8080/${activeState}/district-${mode}/box/${activeRace.toLowerCase()}`)
      .then(response => {setBoxandWhiskerData(response.data[0]);
        setCircleData(response.data[1])
      })
      .catch(error => console.log(error.response.data))
      // If Active State changes, then also reset districtData
      setDistrictGeoJsonData("")
  }, [activeState, mode, activeRace]);

    const resizeMap = (mapRef) => {
      const resizeObserver = new ResizeObserver(() => mapRef.current?.invalidateSize())
      const container = document.getElementById(`/map-container-district-${mode}`)
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
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(districtGeoJsonData)}
        zoom={7} className="leaflet-container" ref={mapRef} id={`map-container-district-${mode}`}
        whenReady={() => resizeMap(mapRef)}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={districtGeoJsonData} style={districtWindow} key={JSON.stringify(districtGeoJsonData)}/>
        </MapContainer></div>
      </div>
      <div className='leaflet-container-big'>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {/* GUI-16: Display Ensemble Splits in Bar Chart */}
          <EnsembleSplits data={ensembleSplitData} width={width} height={proposedHeight}/>
          {/* GUI-17: Display Box & Whisker Data */}
          <h3 style={{marginBottom: "0.5rem"}}>Box and Whisker Data</h3>
          <BoxandWhiskerChart data={boxandWhiskerData} circleData={circleData} width={width} height={proposedHeight}/>
          {/* <BoxandWhiskerExtra /> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProposedVRAMap;