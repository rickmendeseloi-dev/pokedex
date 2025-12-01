import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./home.css";
import Navbar from "../componentes/NavBar/index.jsx";
import logo from '../assets/logo3pk.png'; 

const typeColors = {
  grass: '#78C850', grama: '#78C850',
  fire: '#F08030', fogo: '#F08030',
  water: '#6890F0', agua: '#6890F0', água: '#6890F0',
  bug: '#A8B820', inseto: '#A8B820',
  normal: '#A8A878',
  poison: '#A040A0', veneno: '#A040A0',
  electric: '#F8D030', eletrico: '#F8D030', elétrico: '#F8D030',
  ground: '#E0C068', terra: '#E0C068',
  fairy: '#EE99AC', fada: '#EE99AC',
  fighting: '#C03028', lutador: '#C03028',
  psychic: '#F85888', psiquico: '#F85888', psíquico: '#F85888',
  rock: '#B8A038', pedra: '#B8A038',
  ghost: '#705898', fantasma: '#705898',
  ice: '#98D8D8', gelo: '#98D8D8',
  dragon: '#7038F8', dragao: '#7038F8', dragão: '#7038F8',
  steel: '#B8B8D0', aco: '#B8B8D0', aço: '#B8B8D0',
  flying: '#A890F0', voador: '#A890F0',
};

export default function Home({ setPokemonData }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generationLimit, setGenerationLimit] = useState(4);
  const [searchText, setSearchText] = useState(""); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemonsByGenerations = async () => {
      setLoading(true);
      setError(null);
      try {
        const genEndpoints = [];
        for (let g = 1; g <= generationLimit; g++) genEndpoints.push(`https://pokeapi.co/api/v2/generation/${g}/`);
        const genResponses = await Promise.all(genEndpoints.map((e) => axios.get(e)));

        const speciesNames = [];
        genResponses.forEach((res) => {
          const species = res.data.pokemon_species || [];
          species.forEach((s) => {
            if (!speciesNames.includes(s.name)) speciesNames.push(s.name);
          });
        });

        const promises = speciesNames.map((name) => axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`));
        const settled = await Promise.allSettled(promises);
        const successes = settled.filter(r => r.status === 'fulfilled').map(r => r.value.data);
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
    navigate(`/profile/${pokemon.id}`, { state: { pokemon } });
  };

  const filteredPokemons = pokemons.filter((p) => {
    if (!searchText) return true;
    const lowerText = searchText.toLowerCase();
    return (
      p.name.toLowerCase().includes(lowerText) ||
      String(p.id).includes(lowerText)
    );
  });

  return (
    <div>
      <Navbar pokemonFilter={setSearchText} />
      <div className="home-container">
        <main className="home-content">
          <img 
            src={logo} 
            alt="Pokémon Logo" 
            className="pokemon-logo" 
          />

          <h1>Pokédex</h1>

          <div style={{ marginBottom: 12, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            <Link to="/categorias" className="btn">Ver por Categorias</Link>
            <Link to="/geracoes" className="btn">Ver por Gerações</Link>
          </div>

          {loading ? (
            <p>Carregando pokémons...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <p style={{ marginBottom: 8, fontWeight: 700 }}>
                Mostrando {filteredPokemons.length} pokémons
              </p>
              
              <div className="grid-cards">
                {filteredPokemons.map((p) => {
                  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
                  
                  return (
                    <div key={p.id} className="card-clickable" onClick={() => pokemonPickHandler(p)}>
                      <img src={imgUrl} alt={p.name} loading="lazy" />
                      
                      <h3>
                        <span style={{ color: '#999', fontSize: '0.8em', marginRight: '6px' }}>
                          #{String(p.id).padStart(3, '0')}
                        </span>
                        {p.name}
                      </h3>

                      <div className="types-wrapper">
                        {p.types.map((slot) => {
                          const typeName = slot.type ? slot.type.name : 'normal';
                          return (
                            <span 
                              key={typeName} 
                              className="type-badge"
                              style={{ backgroundColor: typeColors[typeName] || '#A8A878' }}
                            >
                              {typeName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {filteredPokemons.length === 0 && (
                  <p>Nenhum pokémon encontrado.</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}