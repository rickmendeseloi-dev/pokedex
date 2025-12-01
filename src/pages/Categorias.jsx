import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categorias.css";

export default function Categorias() {
  const navigate = useNavigate();
  // LISTA EM PORTUGUÊS → API EM INGLÊS
  const categorias = [
    { nome: "Grama", tipo: "grass" },
    { nome: "Fogo", tipo: "fire" },
    { nome: "Água", tipo: "water" },
    { nome: "Elétrico", tipo: "electric" },
    { nome: "Voador", tipo: "flying" },
    { nome: "Inseto", tipo: "bug" },
    { nome: "Venenoso", tipo: "poison" },
    { nome: "Normal", tipo: "normal" },
    { nome: "Terra", tipo: "ground" },
    { nome: "Dragão", tipo: "dragon" },
    { nome: "Dark", tipo: "dark" },
    { nome: "Fantasma", tipo: "ghost" },
    { nome: "Lutador", tipo: "fighting" },
    { nome: "Fada", tipo: "fairy" },
    { nome: "Rock", tipo: "rock" },
    { nome: "Gelo", tipo: "ice" },
    { nome: "Metal", tipo: "steel" }
  ];

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [pokemons, setPokemons] = useState([]);

  // Cores dos tipos (igual Home)
  const TYPE_COLORS = {
    grass: '#7AC74C',
    fire: '#EE8130',
    water: '#6390F0',
    bug: '#A6B91A',
    normal: '#A8A77A',
    poison: '#A33EA1',
    electric: '#F7D02C',
    ground: '#E2BF65',
    fairy: '#D685AD',
    fighting: '#C22E28',
    psychic: '#F95587',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    flying: '#A98FF3',
  };

  function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Função para navegar para o Profile do Pokémon
  const handlePokemonClick = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonData = response.data;
      navigate(`/profile/${pokemonData.id}`, { state: { pokemon: pokemonData } });
    } catch (error) {
      console.error("Erro ao buscar detalhes do pokémon:", error);
      navigate(`/profile/${pokemonId}`);
    }
  };

  // PEGAR O ID DO POKEMON DA URL
  function getPokemonId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
  }

  // BUSCAR POKÉMONS DA CATEGORIA
  useEffect(() => {
    if (!categoriaSelecionada) return;

    fetch(`https://pokeapi.co/api/v2/type/${categoriaSelecionada}`)
      .then((res) => res.json())
      .then((data) => {
        // A API de types retorna um array com objetos "pokemon" dentro
        // Fetch details para cada pokemon para obter seus tipos
        const pokemonPromises = data.pokemon.map((p) => {
          const id = getPokemonId(p.pokemon.url);
          return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => res.json())
            .then((details) => ({
              ...p,
              pokemon: { ...p.pokemon, types: details.types }
            }));
        });
        
        Promise.all(pokemonPromises).then((enrichedPokemons) => {
          setPokemons(enrichedPokemons);
        });
      });
  }, [categoriaSelecionada]);

  return (
    <div className="categorias-container">
      <div style={{ position: 'relative', marginBottom: 30 }}>
        <h1>Categorias de Pokémons</h1>
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '10px 20px',
            background: '#ff6b6b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 14
          }}
        >
          ← Voltar para Home
        </button>
      </div>

      {/* MENU DAS CATEGORIAS */}
      <div className="categorias-menu">
        {categorias.map((cat) => (
          <button
            key={cat.tipo}
            onClick={() => setCategoriaSelecionada(cat.tipo)}
            className={categoriaSelecionada === cat.tipo ? 'ativo' : ''}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* LISTA DE POKÉMONS */}
      {categoriaSelecionada && (
        <>
          <h2>
            Tipo: {categorias.find(c => c.tipo === categoriaSelecionada)?.nome}
          </h2>

          <div className="pokemon-grid">
            {pokemons.map((p) => {
              // Na API de Type, o objeto vem aninhado em p.pokemon
              const nome = p.pokemon.name;
              const url = p.pokemon.url;
              const id = getPokemonId(url);
              const types = p.pokemon.types || [];

              return (
                <div
                  key={id}
                  className="pokemon-card"
                  onClick={() => handlePokemonClick(id)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={nome}
                  />
                  <p>{nome}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {types && types.map((t) => (
                      <span
                        key={t.type.name}
                        style={{
                          backgroundColor: TYPE_COLORS[t.type.name] || '#777',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {capitalize(t.type.name)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}