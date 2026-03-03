import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';

function CompareMap({ activeState, latitude, longitude }){
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [proposedGeoJsonDataVra, setProposedGeoJsonDataVra] = useState("");
  const [proposedGeoJsonDataNonVra, setProposedGeoJsonDataNonVra] = useState("");
  const [districtOne, setDistrictOne] = useState("");
  const [districtTwo, setDistrictTwo] = useState("");
  const [currentMode, setCurrentMode] = useState("Select a Comparison Option");

    // 2 modes - district-vra (Voting Rights Act), district-non-vra (Race Blind Districting)
  useEffect(() => {
      axios.get(`http://localhost:3000/api/${activeState}/district-compare`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
            setProposedGeoJsonDataVra(response.data[1]);
            setProposedGeoJsonDataNonVra(response.data[2])})
      .catch(error => console.log(error.response.data))
  }, [activeState]);

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
    <>
    <div className="leaflet-containerset-big">
        <h3 style={{margin: "0 0.5em"}}> Compare Districts: </h3>
        <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" variant='outline-secondary'>
            {currentMode}
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item onClick={() => {setDistrictOne(districtGeoJsonData); setDistrictTwo(proposedGeoJsonDataVra);
              setCurrentMode("Current / Proposed-VRA-Compliant")
            }}>Current / Proposed-VRA-Compliant</Dropdown.Item>
            <Dropdown.Item onClick={() => {setDistrictOne(districtGeoJsonData); setDistrictTwo(proposedGeoJsonDataNonVra)
              setCurrentMode("Current / Proposed-Race-Blind")
            }}>Current / Proposed-Race-Blind</Dropdown.Item>
            <Dropdown.Item onClick={() => {setDistrictOne(proposedGeoJsonDataVra); setDistrictTwo(proposedGeoJsonDataNonVra)
              setCurrentMode("Proposed-VRA-Compliant / Proposed-Race-Blind")
            }}>Proposed-VRA-Compliant / Proposed-Race-Blind</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        {/* GUI-19 - Display an interesting district plan */}
      <div className='leaflet-container-big'>
        <h1>District One</h1>
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
        <h1>District Two</h1>
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
    </>
  );
};

export default CompareMap;