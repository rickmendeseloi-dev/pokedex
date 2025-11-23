import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // opcional ALAN

export default function Home() {
  return (
    <div className="home-container">

      {/* MENU SUPERIOR */}
      <header className="menu">
        <Link to="/" className="logo">
          <img 
            src="/images/pokeball.png"
            alt="Home"
            className="pokeball"
          />
        </Link>

        <nav>
          <Link to="/geracoes" className="menu-item">Gerações</Link>
          <Link to="/categorias" className="menu-item">Categorias</Link>
        </nav>
      </header>

      {/* CONTEÚDO CENTRAL */}
      <main className="home-content">
        <h1>Pokédex React</h1>
        <p>Bem-vindo! Escolha uma opção no menu para navegar.</p>

        <div className="home-buttons">
          <Link to="/geracoes" className="btn">Pokémons por Geração</Link>
          <Link to="/categorias" className="btn">Pokémons por Categoria</Link>
        </div>
      </main>
    </div>
  );
}
