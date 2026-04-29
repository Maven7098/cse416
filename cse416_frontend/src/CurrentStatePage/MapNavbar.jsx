import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {NavLink, Outlet} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Navbar.css';

function MapNavbar({activeState, activeRace, setActiveRace}) {
  let activeStateName = ""
  let destination = ""

  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  switch (activeState) {
    // Since Hispanic/Latino are the only feasible racial category in Iowa, force activeRace to HISPANIC if Iowa is selected
    case 'ia': activeStateName="Iowa"; destination="iowa"; setActiveRace("HISPANIC"); break;
    case 'ga': activeStateName="Georgia"; destination="georgia"; break;
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
    <Navbar expand="lg" className="data-bs-theme-dark">
      <Container fluid className="px-0">
        <Navbar.Brand className="subnav-brand-fixed">{activeStateName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <div className="d-lg-flex align-items-lg-center w-100">
            <Nav className="mx-lg-auto">
              <Nav.Link as={NavLink} end to={`/${destination}`}>
                State Information</Nav.Link>
              <Nav.Link as={NavLink} end to={`/${destination}/polarization`}>
                Racial Polarization</Nav.Link>
            </Nav>
            <NavDropdown className="ms-lg-auto" title={`Selected: ${currentRace}`}>
              { activeState == 'ga' && <NavDropdown.Item onClick={() => setActiveRace("BLACK")}>Black / African American</NavDropdown.Item> }
              <NavDropdown.Item onClick={() => setActiveRace("HISPANIC")}>Hispanic / Latino</NavDropdown.Item>
              { activeState == 'ga' && <NavDropdown.Item onClick={() => setActiveRace("ASIAN")}>Asian / Asian American</NavDropdown.Item> }
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Outlet />
    </>
  );
}

export default MapNavbar;
