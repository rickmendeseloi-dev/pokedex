import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importando a imagem corretamente
import logo from '../../assets/logo2pk.png'; 

export default function Navbar({ pokemonFilter = () => {}, hideSearch = false }) {
  const navigate = useNavigate();

  return (
    <header style={{ background: '#e40f0fff', color: '#fff', padding: '10px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          <img 
            src={logo} 
            alt="logo" 
            // AUMENTEI AQUI DE 36 PARA 55
            style={{ height: 55, cursor: 'pointer', objectFit: 'contain' }} 
            onClick={() => navigate('/')} 
          />
          
        </div>

        {!hideSearch && (
          <input
            type="text"
            placeholder="Pesquisar..."
            onChange={(e) => pokemonFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: 'none', width: 200 }}
          />
        )}
      </div>
    </header>
  );
}