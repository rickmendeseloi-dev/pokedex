import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Geracoes from "./pages/Geracoes";
import Categorias from "./pages/Categorias";
import Profile from "./pages/Profile";
import "./App.css";
function App() {
  const [pokemonData, setPokemonData] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setPokemonData={setPokemonData} />} />
        <Route path="/geracoes" element={<Geracoes />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/profile" element={<Profile pokemonData={pokemonData} />} />
        <Route path="/profile/:id" element={<Profile pokemonData={pokemonData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
