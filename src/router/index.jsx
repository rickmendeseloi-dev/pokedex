import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

export default function Router() {
  const [pokemonData, setPokemonData] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setPokemonData={setPokemonData} />} />
<<<<<<< HEAD
  <Route path="/profile" element={<Profile pokemonData={pokemonData} />} />
=======
        <Route path="/profile" element={<Profile pokemonData={pokemonData} />} />
>>>>>>> a253c209efd93af2ba2e168de824acc267d39cd9
      </Routes>
    </BrowserRouter>
  );
}