import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainNavbar from './Navbar.jsx'
import Home from "./Home.jsx";
import Map from "./Map.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


// import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainNavbar />}>
          <Route index element={<Home />} />
          <Route path="iowa" element={<Map activeState={"ia"} />} />
          <Route path="georgia" element={<Map activeState={"ga"} />} />
          {/* For any undefined pages, throw 404 error */}
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);