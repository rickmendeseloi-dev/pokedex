import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Geracoes.css';

// Cores dos tipos (Padronizado)
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

function Geracoes() {
  const [pokemons, setPokemons] = useState([]);
  const [geracaoAtual, setGeracaoAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para pegar ID da URL (caso precise)
  const pegarIdDaUrl = (url) => {
    if (!url) return null;
    const partes = url.split('/').filter(Boolean);
    return partes[partes.length - 1];
  };

  useEffect(() => {
    const carregarPokemons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${geracaoAtual}`);
        const lista = response.data.pokemon_species;
        
        // Busca detalhes para pegar imagem e tipos
        const pokemonPromises = lista.map((p) => {
          const id = pegarIdDaUrl(p.url);
          // Filtro para evitar formas alternativas quebradas (opcional)
          if(parseInt(id) > 10000) return null;

          return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => res.data)
            .catch(() => null); // Se der erro num pokemon específico, ignora
        });
        
        const results = await Promise.all(pokemonPromises);
        // Filtra nulos e ordena por ID
        const enrichedPokemons = results
            .filter(p => p !== null)
            .sort((a, b) => a.id - b.id);

        setPokemons(enrichedPokemons);
      } catch (error) {
        console.error("Erro ao buscar gerações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPokemons();
  }, [geracaoAtual]);

  const handlePokemonClick = (pokemon) => {
    navigate(`/profile/${pokemon.id}`, { state: { pokemon } });
  };

  return (
    <div className="geracoes-container">
      {/* HEADER */}
      <div className="header-geracoes">
        <button onClick={() => navigate('/')} className="btn-voltar">
          ← Voltar
        </button>
        <h1>Pokémons por Geração</h1>
      </div>

      {/* MENU DE GERAÇÕES */}
      <div className="botoes-geracao">
        {[1, 2, 3, 4].map((gen) => (
          <button 
            key={gen} 
            onClick={() => setGeracaoAtual(gen)}
            className={geracaoAtual === gen ? 'ativo' : ''}
          >
            {gen}ª Geração
          </button>
        ))}
      </div>

      {/* LISTAGEM GRID */}
      {loading ? (
        <p style={{textAlign: 'center', marginTop: 50}}>Carregando...</p>
      ) : (
        <div className="grid-cards">
          {pokemons.map((pokemon) => {
            // URL DA IMAGEM HD
            const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
            const types = pokemon.types || [];

            return (
              <div
                key={pokemon.id}
                className="card-clickable"
                onClick={() => handlePokemonClick(pokemon)}
              >
                {/* Imagem */}
                <img src={imgUrl} alt={pokemon.name} loading="lazy" />
                
                {/* Nome e ID */}
                <h3>
                    <span style={{ color: '#999', fontSize: '0.8em', marginRight: '6px' }}>
                        #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    {pokemon.name}
                </h3>

                {/* Tipos Coloridos */}
                <div className="types-wrapper">
                  {types.map((t) => (
                    <span
                      key={t.type.name}
                      className="type-badge"
                      style={{
                        backgroundColor: TYPE_COLORS[t.type.name] || '#777'
                      }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Geracoes;