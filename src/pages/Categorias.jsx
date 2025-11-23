import React, { useState, useEffect } from "react";
// Removi o useNavigate porque vamos usar o Modal, igual na tela de Gerações
import Modal from "../components/Modal"; 

export default function Categorias() {
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
    { nome: "Terra", tipo: "ground" }
  ];

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  
  // Estado para controlar o Modal (Igual você fez em Geracoes)
  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);

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
        setPokemons(data.pokemon); 
      });
  }, [categoriaSelecionada]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1 style={{ marginBottom: 20 }}>Categorias de Pokémons</h1>

      {/* MENU DAS CATEGORIAS */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 30 }}>
        {categorias.map((cat) => (
          <button
            key={cat.tipo}
            onClick={() => setCategoriaSelecionada(cat.tipo)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: categoriaSelecionada === cat.tipo ? "#ffcb05" : "#f5f5f5", // Destaque se ativo
              color: categoriaSelecionada === cat.tipo ? "#000" : "#333",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* LISTA DE POKÉMONS */}
      {categoriaSelecionada && (
        <>
          <h2 style={{ marginBottom: 10 }}>
            Tipo: {categorias.find(c => c.tipo === categoriaSelecionada)?.nome}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 20
            }}
          >
            {pokemons.map((p) => {
              // Na API de Type, o objeto vem aninhado em p.pokemon
              const nome = p.pokemon.name;
              const url = p.pokemon.url;
              const id = getPokemonId(url);

              return (
                <div
                  key={id}
                  // AQUI: Ao clicar, salvamos o nome para abrir o Modal
                  onClick={() => setPokemonSelecionado(nome)}
                  style={{
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                  }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={nome}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <p style={{ marginTop: 10, textTransform: "capitalize", fontWeight: "bold" }}>
                    {nome}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* COMPONENTE MODAL (Reutilizado) */}
      {pokemonSelecionado && (
        <Modal 
          nomePokemon={pokemonSelecionado} 
          fecharModal={() => setPokemonSelecionado(null)} 
        />
      )}
    </div>
  );
}