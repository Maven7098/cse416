import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';

function CompareMap({ activeState, currentMode, latitude, longitude }){
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [proposedGeoJsonDataVra, setProposedGeoJsonDataVra] = useState("");
  const [proposedGeoJsonDataNonVra, setProposedGeoJsonDataNonVra] = useState("");
  const [districtOne, setDistrictOne] = useState("");
  const [districtTwo, setDistrictTwo] = useState("");
  const [districtOneName, setDistrictOneName] = useState("District 1");
  const [districtTwoName, setDistrictTwoName] = useState("District 2");

  // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
      axios.get(`http://localhost:3000/api/${activeState}/district-compare`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
            setProposedGeoJsonDataVra(response.data[1]);
            setProposedGeoJsonDataNonVra(response.data[2])})
      .catch(error => console.log(error.response.data))
  }, [activeState]);

  // Switch District #1 and #2 based on current Mode
  useEffect(() => {
    switch (currentMode) {
    case "Current / Proposed-VRA-Compliant":
      setDistrictOne(districtGeoJsonData);
      setDistrictOneName("Current District")
      setDistrictTwo(proposedGeoJsonDataVra);
      setDistrictTwoName("Proposed District (VRA Compliant)")
      break;
    case "Current / Proposed-Race-Blind":
      setDistrictOne(districtGeoJsonData);
      setDistrictOneName("Current District")
      setDistrictTwo(proposedGeoJsonDataNonVra);
      setDistrictTwoName("Proposed District (Race Blind)")
      break;
    case "Proposed-VRA-Compliant / Proposed-Race-Blind":
      setDistrictOne(proposedGeoJsonDataVra);
      setDistrictOneName("Proposed District (VRA Compliant)")
      setDistrictTwo(proposedGeoJsonDataNonVra);
      setDistrictTwoName("Proposed District (Race Blind)")
      break;
    default:
      setDistrictOne("");
      setDistrictOneName("District 1")
      setDistrictTwo("");
      setDistrictOne("");
      setDistrictTwoName("District 2")
    }
  }, [currentMode])

    const resizeMapOne = (mapRefOne) => {
      const resizeObserverOne = new ResizeObserver(() => mapRefOne.current?.invalidateSize())
      const containerOne = document.getElementById('map-container-district-one')
      if (containerOne) {
        resizeObserverOne.observe(containerOne)
      }
    }
    const resizeMapTwo = (mapRefTwo) => {
      const resizeObserverTwo = new ResizeObserver(() => mapRefTwo.current?.invalidateSize())
      const containerTwo = document.getElementById('map-container-district-two')
      if (containerTwo) {
        resizeObserverTwo.observe(containerTwo)
      }
    }
    const mapRefOne = useRef(null)
    const mapRefTwo = useRef(null)

  return (
    // Load the GeoJSON for the districting map
    // For Map 1 only: Map 2 does not have districting map
    // I will use GA for the prototype, although this may or may not be carried over to the final product
    // Take note on the "key" in both the MapContainer and GeoJSON objects; they are used to force updates
    // in accordance with the Navbar
    <div className="leaflet-containerset">
        {/* GUI-19 - Display an interesting district plan */}
      <div className='leaflet-container-big'>
        <h3>{districtOneName}</h3>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(districtOne)}
        zoom={7} className="leaflet-container" ref={mapRefOne} id={'map-container-district-one'}
        whenReady={() => resizeMapOne(mapRefOne)}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={districtOne} key={JSON.stringify(districtOne)}/>
        </MapContainer>
      </div>
      <div className='leaflet-container-big'>
        <h3>{districtTwoName}</h3>
        <MapContainer center={[latitude, longitude]} key={JSON.stringify(districtTwo)}
        zoom={7} className="leaflet-container" ref={mapRefTwo} id={'map-container-district-two'}
        whenReady={() => resizeMapTwo(mapRefTwo)}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON data={districtTwo} key={JSON.stringify(districtTwo)}/>
        </MapContainer>
      </div>
    </div>
  );
};

export default CompareMap;