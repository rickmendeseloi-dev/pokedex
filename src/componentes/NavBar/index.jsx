import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
// Importando a imagem corretamente
import logo from '../../assets/logo2pk.png'; 

export default function Navbar({ pokemonFilter = () => {}, hideSearch = false }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!hideSearch && (
            <input
              type="text"
              placeholder="Pesquisar..."
              onChange={(e) => pokemonFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: 'none', width: 200 }}
            />
          )}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid #fff',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            {isDark ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>
      </div>
    </header>
  );
}