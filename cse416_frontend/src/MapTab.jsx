import { Tabs, Tab } from 'react-bootstrap';
import Map from './Map';
import GinglesMap from './GinglesMap';
import EIMap from './EIMap';


function MapTab({activeState}) {

  return (

    <Tabs defaultActiveKey="info" id="uncontrolled-tab-example">

      <Tab eventKey="info" title="State Information">

        <Map activeState={activeState} />

      </Tab>

      <Tab eventKey="gingles" title="Racial Polarization">

        <GinglesMap activeState={activeState} />

      </Tab>

      <Tab eventKey="ei" title="Ecological Inference">

        <EIMap activeState={activeState} />

      </Tab>

    </Tabs>

  );

}


export default MapTab;