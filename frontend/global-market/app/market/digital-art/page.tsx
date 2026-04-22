'use client';

import Link from 'next/link';

const artworks = [
  { title: 'Serpent Spirit', price: 45, image: '🐍', artist: 'Maria' },
  { title: 'Sacred Cycle', price: 89, image: '⭕', artist: 'Eli' },
  { title: 'Dream Walker', price: 120, image: '🌙', artist: 'Sam' },
  { title: 'Earth Prayer', price: 32, image: '🌍', artist: 'Lena' },
  { title: 'Sun Dance', price: 200, image: '☀️', artist: 'Kai' },
  { title: 'River Song', price: 75, image: '💧', artist: 'Maria' },
  { title: 'Thunder Being', price: 150, image: '⚡', artist: 'Eli' },
  { title: 'Corn Mother', price: 95, image: '🌽', artist: 'Sam' },
  { title: 'Star Nation', price: 180, image: '⭐', artist: 'Lena' },
];

export default function DigitalArtCategory() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <Link href="/market" style={{ color: 'white', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#B51D19'
          }}>Digital Art</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>Market</p>
        </div>
      </header>

      {/* Filter Pills */}
      <section style={{ padding: '16px 24px' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          <FilterPill label="All" active />
          <FilterPill label="Paint" />
          <FilterPill label="3D" />
          <FilterPill label="Photo" />
          <FilterPill label="Animation" />
          <FilterPill label="Generative" />
        </div>
      </section>

      {/* Artwork Grid */}
      <main style={{ padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {artworks.map((art) => (
            <Link 
              key={art.title} 
              href={`/market/nft/${art.title.toLowerCase().replace(' ', '-')}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: '#2A2A2A',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}>
                <div style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {art.image}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{art.title}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FDB910'
                  }}>${art.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button style={{
            padding: '16px 48px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Load More
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1A1A1A',
        borderTop: '1px solid #333',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <NavIcon icon="🏠" label="Home" />
        <NavIcon icon="🔍" label="Browse" active />
        <NavIcon icon="❤️" label="Saved" />
        <NavIcon icon="👤" label="Profile" />
      </nav>
    </div>
  );
}

function FilterPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <button style={{
      padding: '8px 20px',
      borderRadius: '20px',
      border: active ? 'none' : '1px solid #333',
      background: active ? 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)' : '#2A2A2A',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }}>
      {active && <span style={{ marginRight: '6px' }}>█</span>}
      {label}
    </button>
  );
}

function NavIcon({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <button style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      color: active ? '#B51D19' : '#6B7280'
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '10px' }}>{label}</span>
    </button>
  );
}
