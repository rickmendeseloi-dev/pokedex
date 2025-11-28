import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ pokemonFilter = () => {}, hideSearch = false }) {
  const navigate = useNavigate();

  return (
    <header style={{ background: '#000', color: '#fff', padding: '10px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/pokemon-logo.png" alt="logo" style={{ height: 36, cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>

        {!hideSearch && (
          <input
            type="text"
            placeholder="Pesquisar..."
            onChange={(e) => pokemonFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 6, border: 'none', width: 200 }}
          />
        )}
      </div>
    </header>
  );
}
