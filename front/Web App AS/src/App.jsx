import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.jsx";
import Registrer from "./pages/Registrer.jsx";
import Client from "./pages/Client.jsx";
import Home from "./pages/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [popup, setPopup] = useState({ login: false, registrer: false });
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home popup={popup} setPopup={setPopup} />}
        ></Route>
        <Route
          path="/login"
          element={<Login popup={popup} setPopup={setPopup} />}
        ></Route>
        <Route
          path="/registrer"
          element={<Registrer popup={popup} setPopup={setPopup} />}
        ></Route>
        <Route path="/client" element={<Client />}></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

// Montrer les infos des rdvs futurs et passés

export default App;
