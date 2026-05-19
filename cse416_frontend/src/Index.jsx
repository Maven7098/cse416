import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import MainNavbar from "./CurrentStatePage/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/index.css";

const Home = lazy(() => import("./Home.jsx"));
const MapNavbar = lazy(() => import("./CurrentStatePage/MapNavbar.jsx"));
const MapTab = lazy(() => import("./CurrentStatePage/MapTab.jsx"));
const GinglesTab = lazy(() => import("./CurrentStatePage/GinglesTab.jsx"));
const ProposedNavbar = lazy(() => import("./ProposedStatePage/ProposedNavbar.jsx"));
const ProposedMapTab = lazy(() => import("./ProposedStatePage/ProposedMapTab.jsx"));
const CompareMapTab = lazy(() => import("./ProposedStatePage/CompareMapTab.jsx"));

// import NoPage from "./pages/NoPage";

export default function App() {
  const [activeRace, setActiveRace] = useState("BLACK");

  const raceMap = {
    HISPANIC: "Hispanic",
    BLACK: "Black",
    ASIAN: "Asian",
    WHITE: "White",
  };

  const currentRace = raceMap[activeRace] || "Black";

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainNavbar />}>
            <Route index element={<Home />} />
            <Route
              path="iowa"
              element={
                <>
                  <MapNavbar
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <MapTab
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    latitude={41.878}
                    longitude={-93.0977}
                  />
                </>
              }
            />
            <Route
              path="georgia"
              element={
                <>
                  <MapNavbar
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <MapTab
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    latitude={33.2478}
                    longitude={-83.4411}
                  />
                </>
              }
            />
            <Route
              path="iowa/polarization"
              element={
                <>
                  <MapNavbar
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <GinglesTab
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    latitude={41.878}
                    longitude={-93.0977}
                  />
                </>
              }
            />
            <Route
              path="georgia/polarization"
              element={
                <>
                  <MapNavbar
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <GinglesTab
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    latitude={33.2478}
                    longitude={-83.4411}
                  />
                </>
              }
            />
            <Route
              path="iowa/proposed/vra"
              element={
                <>
                  <ProposedNavbar
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <ProposedMapTab
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    mode="vra"
                    latitude={41.878}
                    longitude={-93.0977}
                  />
                </>
              }
            />
            <Route
              path="georgia/proposed/vra"
              element={
                <>
                  <ProposedNavbar
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <ProposedMapTab
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    mode="vra"
                    latitude={33.2478}
                    longitude={-83.4411}
                  />
                </>
              }
            />
            <Route
              path="iowa/proposed/nonvra"
              element={
                <>
                  <ProposedNavbar
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <ProposedMapTab
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    mode="non-vra"
                    latitude={41.878}
                    longitude={-93.0977}
                  />
                </>
              }
            />
            <Route
              path="georgia/proposed/nonvra"
              element={
                <>
                  <ProposedNavbar
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <ProposedMapTab
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    mode="non-vra"
                    latitude={33.2478}
                    longitude={-83.4411}
                  />
                </>
              }
            />
            <Route
              path="iowa/proposed/compare"
              element={
                <>
                  <ProposedNavbar
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <CompareMapTab
                    activeState="ia"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    activeStateName="Iowa"
                    mode="nonvra"
                  />
                </>
              }
            />
            <Route
              path="georgia/proposed/compare"
              element={
                <>
                  <ProposedNavbar
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    setActiveRace={setActiveRace}
                  />
                  <CompareMapTab
                    activeState="ga"
                    activeRace={activeRace}
                    currentRace={currentRace}
                    activeStateName="Georgia"
                    mode="nonvra"
                  />
                </>
              }
            />
            {/* For any undefined pages, throw 404 error */}
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
