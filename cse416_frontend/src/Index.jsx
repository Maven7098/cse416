import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavbar from './Navbar.jsx'
import Home from "./Home.jsx";
import MapTab from "./MapTab.jsx";
import ProposedMapTab from './ProposedMapTab.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainNavbar />}>
          <Route index element={<Home />} />
          <Route path="iowa" element={<MapTab activeState={"ia"} />} />
          <Route path="georgia" element={<MapTab activeState={"ga"} />} />
          <Route path="iowa-proposed" element={<ProposedMapTab activeState={"ia"} />} />
          <Route path="georgia-proposed" element={<ProposedMapTab activeState={"ga"} />} />
          {/* For any undefined pages, throw 404 error */}
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);