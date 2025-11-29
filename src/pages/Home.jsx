import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./home.css";
import Navbar from "../componentes/NavBar/index.jsx";
import PokemonCard from "../componentes/PokemonCards/index.jsx";

export default function Home({ setPokemonData }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [generationLimit, setGenerationLimit] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemonsByGenerations = async () => {
      setLoading(true);
      setError(null);
      setLoadedCount(0);
      try {
        // fetch generation endpoints 1..generationLimit to get species lists
        const genEndpoints = [];
        for (let g = 1; g <= generationLimit; g++) genEndpoints.push(`https://pokeapi.co/api/v2/generation/${g}/`);
        const genResponses = await Promise.all(genEndpoints.map((e) => axios.get(e)));

        // collect species names (dedupe by name)
        const speciesNames = [];
        genResponses.forEach((res) => {
          const species = res.data.pokemon_species || [];
          species.forEach((s) => {
            if (!speciesNames.includes(s.name)) speciesNames.push(s.name);
          });
        });

        // fetch each pokemon detail by species name but tolerate failures
        const promises = speciesNames.map((name) => axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`));
        const settled = await Promise.allSettled(promises);
        const successes = settled.filter(r => r.status === 'fulfilled').map(r => r.value.data);
        setLoadedCount(successes.length);
        const list = successes.sort((a, b) => a.id - b.id);
        setPokemons(list);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar pokémons. Veja o console para mais detalhes.');
      } finally {
        setLoading(false);
      }
    };
    getPokemonsByGenerations();
  }, [generationLimit]);

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
          <div style={{ marginBottom: 12, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/categorias" className="btn">Ver por Categorias</Link>
            <Link to="/geracoes" className="btn">Ver por Gerações</Link>
          </div>

          {loading ? (
            <p>Carregando pokémons...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : pokemons.length === 0 ? (
            <p>Nenhum pokémon disponível.</p>
          ) : (
            <>
              <p style={{ marginBottom: 8, fontWeight: 700 }}>Mostrando {loadedCount} pokémons (até geração {generationLimit})</p>
              <div className="grid-cards" style={{ padding: '0 40px' }}>
                {pokemons.map((p) => (
                  <div key={p.id} className="card-clickable" onClick={() => pokemonPickHandler(p)}>
                    <PokemonCard id={p.id} name={p.name} image={p.sprites.front_default} types={p.types} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
