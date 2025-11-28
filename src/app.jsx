import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Geracoes from "./pages/Geracoes";
import Categorias from "./pages/Categorias";
import Profile from "./pages/Profile";

function App() {
  const [pokemonData, setPokemonData] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Home setPokemonData={setPokemonData} />} />
      <Route path="/geracoes" element={<Geracoes />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/profile" element={<Profile pokemonData={pokemonData} />} />
    </Routes>
  );
}

export default App;
