import React, { useEffect, useState } from 'react';

export default function Modal({ nomePokemon, fecharModal }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nomePokemon) return;
    setLoading(true);
    setPokemon(null);
    fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setPokemon(data))
      .catch(() => setPokemon(null))
      .finally(() => setLoading(false));
  }, [nomePokemon]);

  if (!nomePokemon) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={fecharModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 360,
          maxWidth: '95%',
          background: '#fff',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{nomePokemon}</h3>
          <button onClick={fecharModal} style={{ cursor: 'pointer' }} aria-label="Fechar">Fechar</button>
        </div>

        {loading && <p>Carregando...</p>}

        {!loading && pokemon && (
          <div style={{ marginTop: 12 }}>
            <img
              src={pokemon.sprites?.front_default}
              alt={nomePokemon}
              style={{ width: 120, height: 120 }}
            />
            <p><strong>Tipo:</strong> {pokemon.types.map(t => t.type.name).join(' | ')}</p>
            <p><strong>Altura:</strong> {pokemon.height}</p>
            <p><strong>Peso:</strong> {pokemon.weight}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pokemon.moves?.slice(0, 8).map((m, i) => (
                <span key={i} style={{ padding: '4px 6px', background: '#f0f0f0', borderRadius: 4, fontSize: 12 }}>
                  {m.move.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {!loading && pokemon === null && <p>Detalhes não encontrados.</p>}
      </div>
    </div>
  );
}
