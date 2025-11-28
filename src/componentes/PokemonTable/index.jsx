import React from 'react';
import { typeHandler } from '../../utills';

export default function PokemonTable({ pokemonData }) {
  if (!pokemonData) return null;
  const { height, weight, types } = pokemonData;

  return (
    <div style={{ maxWidth: 280 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
        <strong>Height</strong>
        <span>{height ? `${height} cm` : '—'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
        <strong>Weight</strong>
        <span>{weight ? `${weight} g` : '—'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
        <strong>Type</strong>
        <span style={{ textTransform: 'capitalize' }}>{typeHandler(types)}</span>
      </div>
    </div>
  );
}
