import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../componentes/NavBar/index.jsx";
import "./Profile.css"; // Importando o CSS novo

// Cores (Mesmo padrão da Home)
const typeColors = {
  grass: '#78C850', grama: '#78C850',
  fire: '#F08030', fogo: '#F08030',
  water: '#6890F0', agua: '#6890F0',
  bug: '#A8B820', inseto: '#A8B820',
  normal: '#A8A878',
  poison: '#A040A0', veneno: '#A040A0',
  electric: '#F8D030', eletrico: '#F8D030',
  ground: '#E0C068', terra: '#E0C068',
  fairy: '#EE99AC', fada: '#EE99AC',
  fighting: '#C03028', lutador: '#C03028',
  psychic: '#F85888', psiquico: '#F85888',
  rock: '#B8A038', pedra: '#B8A038',
  ghost: '#705898', fantasma: '#705898',
  ice: '#98D8D8', gelo: '#98D8D8',
  dragon: '#7038F8', dragao: '#7038F8',
  steel: '#B8B8D0', aco: '#B8B8D0',
  flying: '#A890F0', voador: '#A890F0',
};

// Tradução de Stats
const statNames = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Velocidade"
};

export default function Profile({ pokemonData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [localPokemon, setLocalPokemon] = useState(pokemonData || location.state?.pokemon || null);
  const [flavorText, setFlavorText] = useState("");
  const [evolutionDetails, setEvolutionDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch do Pokemon Principal (se não vier via props/state)
  useEffect(() => {
    const idOrName = params.id;
    if (!localPokemon && idOrName) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
        .then(res => res.json())
        .then(data => setLocalPokemon(data))
        .catch(err => console.error("Erro ao buscar pokemon:", err));
    }
  }, [params, localPokemon]);

  // 2. Fetch de Detalhes (Espécie, Descrição e Evoluções)
  useEffect(() => {
    if (!localPokemon) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Busca Species
        const speciesRes = await fetch(localPokemon.species.url);
        const speciesData = await speciesRes.json();

        // Descrição em inglês (ou pt se tiver sorte)
        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'en'); // A API falha muito em PT, melhor garantir EN
        setFlavorText(entry ? entry.flavor_text.replace(/\f/g, ' ') : "No description available.");

        // Cadeia de Evolução
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const evoChain = [];
        let evoDataRecursive = evoData.chain;

        do {
          const evoDetails = evoDataRecursive['evolution_details'][0];
          const pokeName = evoDataRecursive.species.name;
          
          // Pega ID para montar imagem
          const idFromUrl = evoDataRecursive.species.url.split('/')[6];
          
          evoChain.push({
            name: pokeName,
            id: idFromUrl,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idFromUrl}.png`
          });

          evoDataRecursive = evoDataRecursive['evolves_to'][0];
        } while (!!evoDataRecursive && evoDataRecursive.hasOwnProperty('evolves_to'));

        setEvolutionDetails(evoChain);

      } catch (error) {
        console.error("Erro detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [localPokemon]);

  if (!localPokemon) return <div className="profile-container">Carregando...</div>;

  // Dados para renderizar
  const mainType = localPokemon.types[0].type.name;
  const themeColor = typeColors[mainType] || '#777';
  const imgHd = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${localPokemon.id}.png`;

  // Função para mudar de página ao clicar na evolução
  const handleEvoClick = (id) => {
    setLocalPokemon(null); // Reseta para forçar reload
    navigate(`/profile/${id}`);
  };

  return (
    <div>
      <Navbar />
      
      <div className="profile-container" style={{ backgroundColor: themeColor + '33' }}> {/* Fundo clarinho */}
        
        <div className="profile-card">
          
          {/* HEADER COLORIDO */}
          <div className="profile-header" style={{ backgroundColor: themeColor }}>
            <button className="btn-voltar-profile" onClick={() => navigate(-1)}>← Voltar</button>
            
            <div className="poke-id">#{String(localPokemon.id).padStart(3, '0')}</div>
            <h1 className="poke-name">{localPokemon.name}</h1>
            
            <div className="profile-image-container">
              <img src={imgHd} alt={localPokemon.name} className="profile-img-hd" />
            </div>
          </div>

          {/* CORPO BRANCO */}
          <div className="profile-body">
            
            {/* TIPOS */}
            <div className="profile-types">
              {localPokemon.types.map((t) => (
                <span 
                  key={t.type.name} 
                  className="type-pill"
                  style={{ backgroundColor: typeColors[t.type.name] || '#777' }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* ABAS DE INFORMAÇÃO */}
            <h3 className="section-title" style={{ color: themeColor }}>Sobre</h3>
            <p style={{ textAlign: 'center', color: '#555', marginBottom: '20px', lineHeight: '1.6' }}>
              {flavorText}
            </p>

            <div className="info-grid">
              <div className="info-item">
                <h4>Altura</h4>
                <p>{localPokemon.height / 10} m</p>
              </div>
              <div className="info-item">
                <h4>Peso</h4>
                <p>{localPokemon.weight / 10} kg</p>
              </div>
              <div className="info-item">
                <h4>Habilidade</h4>
                <p>{localPokemon.abilities[0]?.ability.name}</p>
              </div>
              <div className="info-item">
                <h4>Experiência</h4>
                <p>{localPokemon.base_experience}</p>
              </div>
            </div>

            {/* STATUS BASE (Barras) */}
            <h3 className="section-title" style={{ color: themeColor }}>Status Base</h3>
            <div className="stats-container">
              {localPokemon.stats.map((s) => (
                <div key={s.stat.name} className="stat-row">
                  <div className="stat-name">{statNames[s.stat.name] || s.stat.name}</div>
                  <div className="stat-value">{s.base_stat}</div>
                  <div className="stat-bar-bg">
                    <div 
                      className="stat-bar-fill"
                      style={{ 
                        width: `${Math.min(s.base_stat, 100)}%`, // Limita visualmente a 100%
                        backgroundColor: themeColor
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* EVOLUÇÕES */}
            <h3 className="section-title" style={{ color: themeColor }}>Evoluções</h3>
            <div className="evolutions-flex">
              {evolutionDetails.map((evo, index) => (
                <React.Fragment key={evo.id}>
                  <div className="evo-item" onClick={() => handleEvoClick(evo.id)}>
                    <img src={evo.image} alt={evo.name} />
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#555' }}>
                      {evo.name}
                    </span>
                  </div>
                  {/* Seta entre as evoluções, mas não no último */}
                  {index < evolutionDetails.length - 1 && (
                    <div className="evo-arrow">➜</div>
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}