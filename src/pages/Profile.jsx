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
  const params = useParams();

  const [localPokemon, setLocalPokemon] = useState(null);
  const [flavorText, setFlavorText] = useState("");
  const [evolutionDetails, setEvolutionDetails] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const idUrl = params.id;
    const estadoNavegacao = location.state?.pokemon;

    if (estadoNavegacao && String(estadoNavegacao.id) === String(idUrl)) {
      setLocalPokemon(estadoNavegacao);
      setLoading(false);
    } 
    else if (idUrl) {
      fetchFromApi(idUrl);
    }
    
  }, [params.id, location.state]);
  useEffect(() => {
    if (!localPokemon) return;
  useEffect(() => {ils = async () => {
      try {
        const speciesRes = await fetch(localPokemon.species.url);
        const speciesData = await speciesRes.json();

        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
        setFlavorText(entry ? entry.flavor_text.replace(/\f/g, ' ') : "No description.");

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
      }
    };

    fetchDetails();
  }, [localPokemon?.id]);

  const handleEvoClick = (id) => {
    navigate(`/profile/${id}`);
  };

  if (loading) return <div className="profile-container"><h3>Carregando...</h3></div>;
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
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px' }}>{flavorText}</p>

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