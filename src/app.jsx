import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importando as páginas
import Home from "./pages/Home";       // O código do Alan
import Geracoes from "./pages/Geracoes"; // O seu código
// import Categorias from "./pages/Categorias"; // Ainda vamos criar esse

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/geracoes" element={<Geracoes />} />
        {/* <Route path="/categorias" element={<Categorias />} /> */}
      </Routes>
  );
}

export default App;
