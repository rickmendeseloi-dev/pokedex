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
    const partes = url.split('/');
    // O ID geralmente é o penúltimo item porque a url termina com /
    return partes[partes.length - 2];
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
            const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            return (
              <div key={pokemon.name} className="card-pokemon" onClick={() => alert(`Aqui abrirá o modal do ${pokemon.name}`)}>
                <img src={imgUrl} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Geracoes;