import Nav from 'react-bootstrap/Nav';

function Tab() {
  return (
    <Nav fill variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link href="/home">State Information</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Racial Polarization</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Proposed Districts</Nav.Link>
          </Nav.Item>
    </Nav>
  );
}

export default Tab;