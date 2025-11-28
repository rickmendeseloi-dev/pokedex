import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Geracoes from "./pages/Geracoes";
import Categorias from "./pages/Categorias";
import Profile from "./pages/Profile";

function App() {
  const [pokemonData, setPokemonData] = useState(null);

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
