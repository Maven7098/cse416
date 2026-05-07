import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/Navbar.css";

function ProposedNavbar({
  activeState,
  activeRace,
  currentRace,
  setActiveRace,
}) {
  let activeStateName = "";
  let destination = "";

  // Set Current State - Name, Latitude, Longitude
  // I have initially thought of setting this on the server
  // But why do we need to do that? Is the latitude or longitude important?
  switch (activeState) {
    case "ia":
      activeStateName = "Iowa";
      destination = "iowa";
      break;
    case "ga":
      activeStateName = "Georgia";
      destination = "georgia";
      break;
  }

  // Iowa only supports Hispanic — force the race selection after render
  useEffect(() => {
    if (activeState === "ia") setActiveRace("HISPANIC");
  }, [activeState]);

  return (
    <>
      <Navbar expand="lg" className="data-bs-theme-dark">
        <Container fluid className="px-0">
          <Navbar.Brand className="subnav-brand-fixed">
            {activeStateName} - District Ensembles
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            <div className="d-lg-flex align-items-lg-center w-100">
              <Nav className="mx-lg-auto">
                <Nav.Link as={NavLink} end to={`/${destination}/proposed/vra`}>
                  Proposed Districts with Voting Rights Act
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  end
                  to={`/${destination}/proposed/nonvra`}
                >
                  Proposed Districts with Race Blind Redistricting
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  end
                  to={`/${destination}/proposed/compare`}
                >
                  Compare Districts
                </Nav.Link>
              </Nav>
              <NavDropdown
                className="ms-lg-auto"
                title={`Selected Racial/Ethnic Group: ${currentRace}`}
              >
                {activeState == "ga" && (
                  <NavDropdown.Item onClick={() => setActiveRace("BLACK")}>
                    Black
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={() => setActiveRace("HISPANIC")}>
                  Hispanic
                </NavDropdown.Item>
                {activeState == "ga" && (
                  <NavDropdown.Item onClick={() => setActiveRace("ASIAN")}>
                    Asian
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export default ProposedNavbar;
