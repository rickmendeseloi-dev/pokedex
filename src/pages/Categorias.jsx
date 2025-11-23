import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Categorias() {
  // LISTA EM PORTUGUÊS → API EM INGLÊS
dconst categorias = [
    { nome: "Grama", tipo: "grass" },
    { nome: "Fogo", tipo: "fire" },
    { nome: "Água", tipo: "water" },
    { nome: "Elétrico", tipo: "electric" },
    { nome: "Voador", tipo: "flying" },
    { nome: "Inseto", tipo: "bug" },
    { nome: "Venenoso", tipo: "poison" },
    { nome: "Normal", tipo: "normal" },
    { nome: "Terra", tipo: "ground" }
d];

dconst [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
dconst [pokemons, setPokemons] = useState([]);

dconst navigate = useNavigate();

  // PEGAR O ID DO POKEMON DA URL
dfunction getPokemonId(url) {
    const partes = url.split("/");
    return partes[partes.length - 2];
d}

  // BUSCAR POKÉMONS DA CATEGORIA
duseEffect(() => {
    if (!categoriaSelecionada) return;

    fetch(`https://pokeapi.co/api/v2/type/${categoriaSelecionada}`)
    d.then((res) => res.json())
    d.then((data) => {
        setPokemons(data.pokemon);
    d});
d}, [categoriaSelecionada]);

dreturn (
    <div style={{ padding: 20 }}>
    d<h1 style={{ marginBottom: 20 }}>Categorias de Pokémons</h1>

      {/* MENU DAS CATEGORIAS */}
    d<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        {categorias.map((cat) => (
        d<button
            key={cat.tipo}
            onClick={() => setCategoriaSelecionada(cat.tipo)}
            style={{
            dpadding: "10px 20px",
            dborderRadius: 8,
            dborder: "1px solid #ccc",
            dbackground: "#f5f5f5",
            dcursor: "pointer",
            dfontWeight: "bold"
            }}
        d>
            {cat.nome}
        d</button>
        ))}
    d</div>

      {/* LISTA DE POKÉMONS */}
    d{categoriaSelecionada && (
        <>
        d<h2 style={{ marginBottom: 10 }}>
            Pokémons do tipo:{" "}
            {categorias.find(c => c.tipo === categoriaSelecionada)?.nome}
        d</h2>

        d<div
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