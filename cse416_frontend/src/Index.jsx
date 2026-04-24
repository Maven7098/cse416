import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MainNavbar from './CurrentStatePage/Navbar.jsx'
import Home from "./Home.jsx";
import MapNavbar from "./CurrentStatePage/MapNavbar.jsx";
import MapTab from "./CurrentStatePage/MapTab.jsx";
import GinglesTab from "./CurrentStatePage/GinglesTab.jsx";
import ProposedNavbar from './ProposedStatePage/ProposedNavbar.jsx'
import ProposedMapTab from './ProposedStatePage/ProposedMapTab.jsx'
import CompareMapTab from "./ProposedStatePage/CompareMapTab.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/index.css';

// import NoPage from "./pages/NoPage";

export default function App() {
  const [activeRace, setActiveRace] = useState("BLACK")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainNavbar />}>
          <Route index element={<Home />} />
          <Route path="iowa" element={<>
            <MapNavbar activeState="ia" activeRace={activeRace} setActiveRace={setActiveRace} />
            <MapTab activeState="ia" activeRace={activeRace} latitude={41.8780} longitude={-93.0977} />
            </>} />
          <Route path="georgia" element={<>
            <MapNavbar activeState="ga" activeRace={activeRace} setActiveRace={setActiveRace} />
            <MapTab activeState="ga" activeRace={activeRace} latitude={33.2478} longitude={-83.4411} />
            </>} />
          <Route path="iowa/polarization" element={<>
            <MapNavbar activeState="ia" activeRace={activeRace} setActiveRace={setActiveRace} />
            <GinglesTab activeState="ia" activeRace={activeRace} latitude={41.8780} longitude={-93.0977} />
          </>} />
          <Route path="georgia/polarization" element={<>
            <MapNavbar activeState="ga" activeRace={activeRace} setActiveRace={setActiveRace} />
            <GinglesTab activeState="ga" activeRace={activeRace} latitude={33.2478} longitude={-83.4411} />
          </>} />
          <Route path="iowa/proposed/vra" element={<>
            <ProposedNavbar activeState="ia" activeRace={activeRace} setActiveRace={setActiveRace} />
            <ProposedMapTab activeState="ia" activeRace={activeRace} mode="vra" latitude={41.8780} longitude={-93.0977} />
          </>} />
          <Route path="georgia/proposed/vra" element={<>
            <ProposedNavbar activeState="ga" activeRace={activeRace} setActiveRace={setActiveRace} />
            <ProposedMapTab activeState="ga" activeRace={activeRace} mode="vra" latitude={33.2478} longitude={-83.4411} />
          </>} />
          <Route path="iowa/proposed/nonvra" element={<>
            <ProposedNavbar activeState="ia" activeRace={activeRace} setActiveRace={setActiveRace} />
            <ProposedMapTab activeState="ia" activeRace={activeRace} mode="non-vra" latitude={41.8780} longitude={-93.0977} />
          </>} />
          <Route path="georgia/proposed/nonvra" element={<>
            <ProposedNavbar activeState="ga" activeRace={activeRace} setActiveRace={setActiveRace} />
            <ProposedMapTab activeState="ga" activeRace={activeRace} mode="non-vra" latitude={33.2478} longitude={-83.4411} />
          </>} />
          <Route path="iowa/proposed/compare" element={<>
            <ProposedNavbar activeState="ia" activeRace={activeRace} setActiveRace={setActiveRace} />
            <CompareMapTab activeState="ia" activeRace={activeRace} activeStateName="Iowa" mode="nonvra" latitude={41.8780} longitude={-93.0977} />
          </>} />
          <Route path="georgia/proposed/compare" element={<>
            <ProposedNavbar activeState="ga" activeRace={activeRace} setActiveRace={setActiveRace} />
            <CompareMapTab activeState="ga" activeRace={activeRace} activeStateName="Georgia" mode="nonvra" latitude={33.2478} longitude={-83.4411} />
          </>} />
          {/* For any undefined pages, throw 404 error */}
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);