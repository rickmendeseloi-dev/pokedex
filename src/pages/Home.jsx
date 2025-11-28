import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./home.css";
import Navbar from "../componentes/NavBar/index.jsx";
import PokemonCard from "../componentes/PokemonCards/index.jsx";

export default function Home({ setPokemonData }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemons = async () => {
      setLoading(true);
      try {
        const endpoints = [];
        for (let i = 1; i <= 151; i++) endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const responses = await Promise.all(endpoints.map((e) => axios.get(e)));
        const list = responses.map((r) => r.data).sort((a, b) => a.id - b.id);
        setPokemons(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPokemons();
  }, []);

  const pokemonPickHandler = (pokemon) => {
    if (setPokemonData) setPokemonData(pokemon);
    // navigate to profile with id in URL and keep pokemon in location state
    navigate(`/profile/${pokemon.id}`, { state: { pokemon } });
  };

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <main className="home-content">
          <h1>Pokédex</h1>
          <div style={{ marginBottom: 12 }}>
            <Link to="/categorias" className="btn">Ver por Categorias</Link>
          </div>

          {loading ? (
            <p>Carregando pokémons...</p>
          ) : (
            <div className="grid-cards" style={{ padding: '0 40px' }}>
              {pokemons.map((p) => (
                <div key={p.id} className="card-clickable" onClick={() => pokemonPickHandler(p)}>
                  <PokemonCard id={p.id} name={p.name} image={p.sprites.front_default} types={p.types} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
