import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
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
        const responses = await axios.all(endpoints.map((e) => axios.get(e)));
        setPokemons(responses.map((r) => r.data));
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
    navigate("/profile");
  };

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <main className="home-content">
          <h1>Pokédex</h1>
          {loading ? (
            <p>Carregando pokémons...</p>
          ) : (
            <div className="grid-cards">
              {pokemons.map((p) => (
                <div key={p.id} onClick={() => pokemonPickHandler(p)} style={{ cursor: 'pointer' }}>
                  <PokemonCard name={p.name} image={p.sprites.front_default} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
