import { Chip, Container, Divider, Paper, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/NavBar/index.jsx";
import PokemonTable from "../componentes/PokemonTable/index.jsx";

export default function Profile({ pokemonData }) {
  const navigate = useNavigate();
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [evolutionDetails, setEvolutionDetails] = useState([]);
  const [flavorText, setFlavorText] = useState("");
  const [generation, setGeneration] = useState("");
  const [habitat, setHabitat] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonData) {
      navigate("/");
    }
  }, [pokemonData, navigate]);

  useEffect(() => {
    if (!pokemonData) return;

    const fetchSpeciesAndEvolutions = async () => {
      setLoadingDetails(true);
      setError(null);
      try {
        // fetch species details (contains flavor text and evolution chain)
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`);
        if (!res.ok) throw new Error("failed to fetch species");
        const sp = await res.json();
        setSpecies(sp);

        // flavor text prefer Portuguese if available
        const entry = sp.flavor_text_entries.find(e => e.language.name === 'pt') || sp.flavor_text_entries.find(e => e.language.name === 'en');
        setFlavorText(entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : 'Descrição não disponível.');

        setGeneration(sp.generation?.name || '');
        setHabitat(sp.habitat?.name || '');

        // fetch evolution chain
        if (sp.evolution_chain && sp.evolution_chain.url) {
          const evoRes = await fetch(sp.evolution_chain.url);
          if (!evoRes.ok) throw new Error('failed to fetch evolution chain');
          const evoData = await evoRes.json();

          const evoList = [];
          const traverse = (node) => {
            if (!node) return;
            evoList.push(node.species.name);
            if (node.evolves_to && node.evolves_to.length) {
              node.evolves_to.forEach(child => traverse(child));
            }
          };
          traverse(evoData.chain);
          setEvolutions(evoList);

          // fetch basic details for each evolution (to get sprite)
          const details = await Promise.all(
            evoList.map(async (name) => {
              try {
                const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                if (!r.ok) return { name };
                const d = await r.json();
                return { name, sprite: d.sprites?.front_default, id: d.id };
              } catch {
                return { name };
              }
            })
          );
          setEvolutionDetails(details);
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados adicionais.');
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchSpeciesAndEvolutions();
  }, [pokemonData]);

  if (!pokemonData) return null;

  const { name, sprites, moves } = pokemonData || {};

  return (
    <>
      <Navbar hideSearch />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>Voltar</Button>
        <Paper elevation={3}>
          <Box display="flex" flexDirection="column" alignItems="center" p={5}>
            <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>{name}</Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" width="100%" gap={2} sx={{ mb: 2 }}>
              <Box component="img" src={sprites.front_default} alt={name} sx={{ width: 200, height: 200 }} />
              <PokemonTable pokemonData={pokemonData} />
            </Box>

            <Box width="100%" sx={{ mt: 2 }}>
              <Divider>Descrição</Divider>
              <Typography variant="body1" sx={{ mt: 1 }}>{flavorText}</Typography>

              <Divider sx={{ mt: 2 }}>Evoluções</Divider>
              {loadingDetails ? (
                <Typography>Carregando evoluções...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1 }}>
                  {evolutionDetails.map((e) => (
                    <Box key={e.name} textAlign="center">
                      {e.sprite ? <img src={e.sprite} alt={e.name} style={{ width: 80, height: 80 }} /> : <div style={{ width: 80, height: 80 }} />}
                      <Typography sx={{ textTransform: 'capitalize' }}>{e.name}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ mt: 2 }}>Informações</Divider>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Geração:</strong> {generation}</Typography>
                <Typography><strong>Habitat:</strong> {habitat || '—'}</Typography>
              </Box>

              <Divider sx={{ mt: 2 }}>Ataques</Divider>
              <Box textAlign="center" marginTop="15px">
                {moves && moves.map((moveData, key) => (
                  <Chip key={key} sx={{ m: '5px' }} label={moveData.move.name} />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
