import { Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import Map from './Map';
import GinglesMap from './GinglesMap';
import EIMap from './EIMap';
import { useState, useEffect } from 'react';

// Data to be imported from the server
import axios from 'axios';


function MapTab({activeState}) {
  const [activeRace, setActiveRace] = useState("BLACK");
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentStateName, setCurrentStateName] = useState("");

  // Set Current State - GeoJSON
  useEffect(() => {
      axios.get(`http://localhost:3000/api/${activeState}/geojson`)
      .then(response => {setDistrictGeoJsonData(response.data[0]);
          setLatitude(response.data[1]);
          setLongitude(response.data[2]);
          setCurrentState(response.data[3])})
      .catch(error => console.log(error.response.data))
      // If Active State changes, then also reset districtData
      setDistrictData("")
  }, [activeState]);

  // Set Current State name
  useEffect(() => {
    setCurrentStateName(currentState.NAME)
  }, [currentState]);

  let currentRace = "Black / African American"
  switch (activeRace) {
      case "HISPANIC":
        currentRace = "Hispanic / Latino"
        break;
      case "BLACK":
        currentRace = "Black / African American"
        break;
      case "ASIAN":
        currentRace = "Asian / Asian American"
        break;
    }

  return (
    <>
    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <h3 style={{margin: "0 0.5em"}}> Select Race: </h3>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" variant='outline-secondary'>
          {currentRace}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setActiveRace("BLACK")}>Black / African American</Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveRace("HISPANIC")}>Hispanic / Latino</Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveRace("ASIAN")}>Asian / Asian American</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>

    <Tabs defaultActiveKey="info" id="uncontrolled-tab-example" fill>
      <Tab eventKey="info" title="State Information">
        <Map activeRace={activeRace} districtGeoJsonData={districtGeoJsonData} latitude={latitude} longitude={longitude}
        districtData={districtData} setDistrictData={setDistrictData} currentState={currentState} />
      </Tab>
      <Tab eventKey="gingles" title="Racial Polarization">
        <GinglesMap activeState={activeState} activeRace={activeRace} currentStateName={currentStateName} />
      </Tab>
      <Tab eventKey="ei" title="Ecological Inference">
        <EIMap activeRace={activeRace} precinctGeoJsonData={districtGeoJsonData} latitude={latitude} longitude={longitude} currentStateName={currentStateName} />
      </Tab>
    </Tabs>
    </>
  );

}


export default MapTab;