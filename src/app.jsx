
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Geracoes from "./pages/Geracoes";
import Categorias from "./pages/Categorias";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/geracoes" element={<Geracoes />} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
  );
}

export default App;