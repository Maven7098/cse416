import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import ProposedVRAMap from './ProposedVRAMap.jsx';
import CompareMap from './CompareMap.jsx';
import { useState } from 'react';


function MapTab({activeState}) {
  const [activeRace, setActiveRace] = useState("BLACK");
  let activeStateName = ""
  let latitude=0;
  let longitude=0;

  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  switch (activeState) {
      case 'ia': activeStateName="Iowa"; latitude=41.8780; longitude=-93.0977; break;
      case 'ga': activeStateName="Georgia"; latitude=33.2478; longitude=-83.4411; break;
    }

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

    <Tabs defaultActiveKey="vra" id="uncontrolled-tab-example" fill>
      <Tab eventKey="vra" title="Proposed Districts with Voting Rights Act">
        <ProposedVRAMap activeState={activeState} activeRace={activeRace} mode="vra" latitude={latitude} longitude={longitude} />
      </Tab>
      <Tab eventKey="non-vra" title="Proposed Districts with Race Blind Districting">
        <ProposedVRAMap activeState={activeState} activeRace={activeRace} mode="non-vra" latitude={latitude} longitude={longitude} />
      </Tab>
      <Tab eventKey="compare" title="Compare Districts">
        <CompareMap activeState={activeState} activeRace={activeRace} latitude={latitude} longitude={longitude} activeStateName={activeStateName} />
      </Tab>
    </Tabs>
    </>
  );

}


export default MapTab;