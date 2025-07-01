import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.jsx";
import Registrer from "./pages/Registrer.jsx";
import Client from "./pages/Client.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/registrer" element={<Registrer />}></Route>
        <Route path="/client" element={<Client />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

// Régler le problème de la fonction de recherche de rdv. Elle ne voit pas bien les rds présents

export default App;
