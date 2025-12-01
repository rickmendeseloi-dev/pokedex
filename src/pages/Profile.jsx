import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../componentes/NavBar/index.jsx";
import "./Profile.css";

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
  dark: '#705746',
};

const statNames = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Velocidade"
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); // ID da URL

  const [localPokemon, setLocalPokemon] = useState(null);
  const [flavorText, setFlavorText] = useState("");
  const [evolutionDetails, setEvolutionDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR DADOS (Prioridade: URL > State)
  useEffect(() => {
    const fetchFromApi = async (id) => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar");
        const data = await res.json();
        setLocalPokemon(data);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };

    const idUrl = params.id;
    const estadoNavegacao = location.state?.pokemon;

    // Se temos dados no state E o ID bate com a URL, usa o state (rápido)
    if (estadoNavegacao && String(estadoNavegacao.id) === String(idUrl)) {
      setLocalPokemon(estadoNavegacao);
      setLoading(false);
    } 
    // Se não, busca na API pelo ID da URL
    else if (idUrl) {
      fetchFromApi(idUrl);
    }
    
  }, [params.id, location.state]);

  // 2. CARREGAR DETALHES (Descrição e Evoluções)
  useEffect(() => {
    if (!localPokemon) return;

    const fetchDetails = async () => {
      try {
        // Busca espécie (para descrição e link de evolução)
        const speciesRes = await fetch(localPokemon.species.url);
        const speciesData = await speciesRes.json();

        // Descrição
        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
        setFlavorText(entry ? entry.flavor_text.replace(/\f/g, ' ') : "No description.");

        // Cadeia de Evolução
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const evoChain = [];
        let evoDataRecursive = evoData.chain;

        do {
          const idFromUrl = evoDataRecursive.species.url.split('/')[6];
          evoChain.push({
            name: evoDataRecursive.species.name,
            id: idFromUrl,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idFromUrl}.png`
          });
          evoDataRecursive = evoDataRecursive['evolves_to'][0];
        } while (!!evoDataRecursive && evoDataRecursive.hasOwnProperty('evolves_to'));

        setEvolutionDetails(evoChain);
      } catch (error) {
        console.error("Erro detalhes:", error);
      }
    };

    fetchDetails();
  }, [localPokemon?.id]); // Roda sempre que o ID mudar

  const handleEvoClick = (id) => {
    navigate(`/profile/${id}`);
  };

  // Renderização condicional para não quebrar se estiver carregando
  if (loading) return <div className="profile-container"><h3>Carregando...</h3></div>;
  if (!localPokemon) return <div className="profile-container"><h3>Pokémon não encontrado.</h3></div>;

  const mainType = localPokemon.types[0].type.name;
  const themeColor = typeColors[mainType] || '#777';
  const imgHd = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${localPokemon.id}.png`;

  return (
    <div>
      <Navbar />
      <div className="profile-container" style={{ backgroundColor: themeColor + '33' }}>
        <div className="profile-card">
          
          <div className="profile-header" style={{ backgroundColor: themeColor }}>
            <button className="btn-voltar-profile" onClick={() => navigate(-1)}>← Voltar</button>
            <div className="poke-id">#{String(localPokemon.id).padStart(3, '0')}</div>
            <h1 className="poke-name">{localPokemon.name}</h1>
            <div className="profile-image-container">
              <img src={imgHd} alt={localPokemon.name} className="profile-img-hd" />
            </div>
          </div>

          <div className="profile-body">
            <div className="profile-types">
              {localPokemon.types.map((t) => (
                <span key={t.type.name} className="type-pill" style={{ backgroundColor: typeColors[t.type.name] }}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <h3 className="section-title" style={{ color: themeColor }}>Sobre</h3>
            <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>{flavorText}</p>

            <div className="info-grid">
              <div className="info-item"><h4>Altura</h4><p>{localPokemon.height / 10} m</p></div>
              <div className="info-item"><h4>Peso</h4><p>{localPokemon.weight / 10} kg</p></div>
              <div className="info-item"><h4>Exp</h4><p>{localPokemon.base_experience}</p></div>
              <div className="info-item"><h4>Habilidade</h4><p>{localPokemon.abilities[0]?.ability.name}</p></div>
            </div>

            <h3 className="section-title" style={{ color: themeColor }}>Status Base</h3>
            <div className="stats-container">
              {localPokemon.stats.map((s) => (
                <div key={s.stat.name} className="stat-row">
                  <div className="stat-name">{statNames[s.stat.name] || s.stat.name}</div>
                  <div className="stat-value">{s.base_stat}</div>
                  <div className="stat-bar-bg">
                    <div className="stat-bar-fill" style={{ width: `${Math.min(s.base_stat, 100)}%`, backgroundColor: themeColor }}></div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="section-title" style={{ color: themeColor }}>Evoluções</h3>
            <div className="evolutions-flex">
              {evolutionDetails.map((evo, index) => (
                <React.Fragment key={evo.id}>
                  <div className="evo-item" onClick={() => handleEvoClick(evo.id)}>
                    <img src={evo.image} alt={evo.name} />
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#555' }}>{evo.name}</span>
                  </div>
                  {index < evolutionDetails.length - 1 && <div className="evo-arrow">➜</div>}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}