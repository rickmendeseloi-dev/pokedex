import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Categorias() {
  // CATEGORIAS QUE VOCÊ VAI EXIBIR
const categorias = [
    "grass",
    "fire",
    "water",
    "electric",
    "flying",
    "bug",
    "poison",
    "normal",
    "ground"
];

const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
const [pokemons, setPokemons] = useState([]);

const navigate = useNavigate();

  // --- Função para pegar o ID da URL do Pokémon ---
function getPokemonId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
}

  // --- BUSCAR OS POKÉMONS DA CATEGORIA SELECIONADA ---
useEffect(() => {
    if (!categoriaSelecionada) return;

    fetch(`https://pokeapi.co/api/v2/type/${categoriaSelecionada}`)
    .then((res) => res.json())
    .then((data) => {
        setPokemons(data.pokemon); // API já devolve a lista
    });
}, [categoriaSelecionada]);

return (
    <div style={{ padding: 20 }}>
    <h1 style={{ marginBottom: 20 }}>Categorias de Pokémons</h1>

      {/* MENU DE CATEGORIAS */}
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        {categorias.map((cat) => (
        <button
            key={cat}
            onClick={() => setCategoriaSelecionada(cat)}
            style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#f2f2f2",
            cursor: "pointer",
            fontWeight: "bold"
            }}
        >
            {cat.toUpperCase()}
        </button>
        ))}
    </div>

      {/* LISTA DE POKÉMONS */}
    {categoriaSelecionada && (
        <>
        <h2 style={{ marginBottom: 10 }}>
            Pokémons do tipo: {categoriaSelecionada.toUpperCase()}
        </h2>

        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 20
            }}
        >
            {pokemons.map((p) => {
            const id = getPokemonId(p.pokemon.url);

            return (
                <div
                key={id}
                onClick={() => navigate(`/detalhes/${id}`)}
                style={{
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#fff"
                }}
                >
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={p.pokemon.name}
                />
                <p style={{ marginTop: 10, textTransform: "capitalize" }}>
                    {p.pokemon.name}
                </p>
                </div>
            );
            })}
        </div>
        </>
    )}
    </div>
);
}
