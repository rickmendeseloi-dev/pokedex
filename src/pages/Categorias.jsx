import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categorias.css";

// Cores dos tipos (Movi para fora para organizar)
const TYPE_COLORS = {
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
  dark: '#705746',
};

export default function Categorias() {
  const navigate = useNavigate();
  
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

  // Função para navegar para o Profile
  const handlePokemonClick = async (pokemonId) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonData = response.data;
      navigate(`/profile/${pokemonData.id}`, { state: { pokemon: pokemonData } });
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      navigate(`/profile/${pokemonId}`);
    }
  };

  function getPokemonId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
  }

  useEffect(() => {
    if (!categoriaSelecionada) return;

    fetch(`https://pokeapi.co/api/v2/type/${categoriaSelecionada}`)
      .then((res) => res.json())
      .then((data) => {
        // Pega todos os pokemons daquela categoria
        const pokemonPromises = data.pokemon.map((p) => {
          const id = getPokemonId(p.pokemon.url);
          // Limitando a ID < 10000 para evitar formas "mega" ou quebradas da API que não têm imagem oficial
          if(parseInt(id) > 10000) return null; 

          return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => res.json())
            .then((details) => ({
              ...p,
              pokemon: { ...p.pokemon, types: details.types }
            }));
        });
        
        Promise.all(pokemonPromises).then((results) => {
            // Remove os nulos (que eram IDs muito altos)
            const enrichedPokemons = results.filter(p => p !== null);
            setPokemons(enrichedPokemons);
        });
      });
  }, [categoriaSelecionada]);

  return (
    <div className="categorias-container">
      <div className="header-categorias">
        <button onClick={() => navigate('/')} className="btn-voltar">
          ← Voltar
        </button>
        <h1>Categorias</h1>
      </div>

      {/* MENU DAS CATEGORIAS */}
      <div className="categorias-menu">
        {categorias.map((cat) => (
          <button
            key={cat.tipo}
            onClick={() => setCategoriaSelecionada(cat.tipo)}
            className={categoriaSelecionada === cat.tipo ? 'cat-btn ativo' : 'cat-btn'}
            style={{ 
                 // Se estiver ativo, usa a cor do tipo. Se não, fica cinza.
                 backgroundColor: categoriaSelecionada === cat.tipo ? TYPE_COLORS[cat.tipo] : '#f5f5f5',
                 color: categoriaSelecionada === cat.tipo ? '#fff' : '#555',
                 borderColor: categoriaSelecionada === cat.tipo ? TYPE_COLORS[cat.tipo] : '#e0e0e0',
            }}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* LISTA DE POKÉMONS */}
      {categoriaSelecionada && (
        <>
          <h2 className="titulo-secao">
            Tipo: <span style={{color: TYPE_COLORS[categoriaSelecionada], fontWeight: '800'}}>
                {categorias.find(c => c.tipo === categoriaSelecionada)?.nome}
            </span>
          </h2>

          <div className="grid-cards">
            {pokemons.map((p) => {
              const nome = p.pokemon.name;
              const url = p.pokemon.url;
              const id = getPokemonId(url);
              const types = p.pokemon.types || [];
              
              // URL da Imagem HD (Official Artwork)
              const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

              return (
                <div
                  key={id}
                  className="card-clickable"
                  onClick={() => handlePokemonClick(id)}
                >
                  <img src={imgUrl} alt={nome} loading="lazy" />
                  
                  {/* Número e Nome */}
                  <h3>
                    <span style={{ color: '#999', fontSize: '0.8em', marginRight: '6px' }}>
                        #{String(id).padStart(3, '0')}
                    </span>
                    {nome}
                  </h3>

                  {/* Pílulas de Tipo */}
                  <div className="types-wrapper">
                    {types.map((t) => (
                      <span
                        key={t.type.name}
                        className="type-badge"
                        style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#777' }}
                      >
                        {t.type.name}
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