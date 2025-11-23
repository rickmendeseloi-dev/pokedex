
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Geracoes from "./pages/Geracoes";
import Categorias from "./pages/Categorias"; // <--- Importe aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/geracoes" element={<Geracoes />} />
        {/* Adicione esta linha abaixo */}
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;