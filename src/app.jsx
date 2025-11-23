import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importando as páginas
import Home from "./pages/Home";       // O código do Alan
import Geracoes from "./pages/Geracoes"; // O seu código
import Categorias from "./pages/Categorias";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/geracoes" element={<Geracoes />} />
        {/* <Route path="/categorias" element={<Categorias />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
