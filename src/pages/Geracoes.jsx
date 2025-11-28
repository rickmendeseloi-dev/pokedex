import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Geracoes.css'; // Vamos criar esse CSS no passo 3

function Geracoes() {
  const [pokemons, setPokemons] = useState([]);
  const [geracaoAtual, setGeracaoAtual] = useState(1); // Começa na geração 1
  const [loading, setLoading] = useState(false);

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
        setPokemons(lista);
      } catch (error) {
        console.error("Erro ao buscar gerações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPokemons();
  }, [geracaoAtual]); // O array de dependência observa a mudança do botão

  return (
    <div className="container">
      <h2>Pokémons por Geração</h2>

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

            return (
              <div
                key={id || pokemon.name}
                className="card-pokemon"
                role="button"
                tabIndex={0}
                onClick={() => alert(`Aqui abrirá o modal do ${displayName}`)}
                onKeyDown={(e) => e.key === 'Enter' && alert(`Aqui abrirá o modal do ${displayName}`)}
              >
                {imgUrl ? <img src={imgUrl} alt={displayName} /> : <div style={{height:100}} />}
                <p style={{ textTransform: 'capitalize' }}>{displayName}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Geracoes;