import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Geracoes.css'; // Vamos criar esse CSS no passo 3

function Geracoes() {
  const [pokemons, setPokemons] = useState([]);
  const [geracaoAtual, setGeracaoAtual] = useState(1); // Começa na geração 1
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cores dos tipos (igual Home e Categorias)
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

  // Função auxiliar para pegar o ID da URL que a API retorna
  // A URL vem assim: "https://pokeapi.co/api/v2/pokemon-species/25/"
  const pegarIdDaUrl = (url) => {
    if (!url) return null;
    const partes = url.split('/').filter(Boolean);
    // O ID geralmente é o último item após filtrar partes vazias
    return partes[partes.length - 1];
  };

  useEffect(() => {
    // Essa função busca os dados sempre que 'geracaoAtual' mudar
    const carregarPokemons = async () => {
      setLoading(true);
      try {
        // O enunciado pedia até a 4ª geração.
        // Endpoint correto: generation/{id}
        const response = await axios.get(`https://pokeapi.co/api/v2/generation/${geracaoAtual}`);
        
        // A lista vem dentro de 'pokemon_species'
        const lista = response.data.pokemon_species;
        
        // Fetch details para cada pokemon para obter seus tipos
        const pokemonPromises = lista.map((p) => {
          const id = pegarIdDaUrl(p.url);
          return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => ({
              ...p,
              types: res.data.types
            }));
        });
        
        const enrichedPokemons = await Promise.all(pokemonPromises);
        setPokemons(enrichedPokemons);
      } catch (error) {
        console.error("Erro ao buscar gerações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPokemons();
  }, [geracaoAtual]); // O array de dependência observa a mudança do botão

  const handlePokemonClick = async (pokemonId) => {
    try {
      // Fetch the pokemon details using the ID
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemonData = response.data;
      // Navigate to profile with the pokemon data in location state
      navigate(`/profile/${pokemonData.id}`, { state: { pokemon: pokemonData } });
    } catch (error) {
      console.error("Erro ao buscar detalhes do pokémon:", error);
      // Fallback: navigate by id if fetch fails
      navigate(`/profile/${pokemonId}`);
    }
  };

  return (
    <div className="container">
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <h2 style={{ textAlign: 'center' }}>Pokémons por Geração</h2>
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

      {/* MENU DE GERAÇÕES (Item 4.1) */}
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

      {/* LISTAGEM (Item 4.1) */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="lista-pokemon">
          {pokemons.map((pokemon) => {
            const id = pegarIdDaUrl(pokemon.url);
            const imgUrl = id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              : "";

            const displayName = pokemon.name ? pokemon.name.replace(/-/g, ' ') : '—';
            const types = pokemon.types || [];

            return (
              <div
                key={id || pokemon.name}
                className="card-pokemon"
                role="button"
                tabIndex={0}
                onClick={() => handlePokemonClick(id)}
                onKeyDown={(e) => e.key === 'Enter' && handlePokemonClick(id)}
              >
                {imgUrl ? <img src={imgUrl} alt={displayName} /> : <div style={{height:100}} />}
                <p style={{ textTransform: 'capitalize', marginBottom: 8 }}>{displayName}</p>
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
      )}
    </div>
  );
}

export default Geracoes;