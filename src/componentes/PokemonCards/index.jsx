import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

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

export default function PokemonCard({ name = 'Pokemon', image = '', types = [], id }) {
  return (
    <Card sx={{ width: 180, borderRadius: 2, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
      <CardActionArea sx={{ p: 1 }}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))' }}>
          <CardMedia
            component="img"
            image={image}
            alt={name}
            sx={{ width: 110, height: 110, objectFit: 'contain', mt: 1 }}
          />
        </Box>
        <CardContent sx={{ pt: 1, pb: 2 }}>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
            {`#${String(id).padStart(3, '0')} ${capitalize(name)}`}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {types && types.map((t) => (
              <Chip
                key={t.type.name}
                label={capitalize(t.type.name)}
                size="small"
                sx={{
                  backgroundColor: TYPE_COLORS[t.type.name] || '#777',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
