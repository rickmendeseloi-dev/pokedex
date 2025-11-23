import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* As telas abaixo serão feitas pelo grupo */}
        <Route path="/geracoes" element={<div>Gerações</div>} />
        <Route path="/categorias" element={<div>Categorias</div>} />
        <Route path="/pokemon/:id" element={<div>Detalhes</div>} />

      </Routes>
    </BrowserRouter>
  );
}
