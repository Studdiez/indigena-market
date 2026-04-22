'use client';

import Link from 'next/link';

const artists = [
  { name: 'Maria Begay', craft: 'Weaver', nation: 'Diné (Navajo)', works: 24, verified: true, image: 'M' },
  { name: 'Eli Whittaker', craft: 'Carver', nation: 'Haida', works: 18, verified: true, image: 'E' },
  { name: 'Sam Blackhorse', craft: 'Painter', nation: 'Lakota', works: 32, verified: true, image: 'S' },
  { name: 'Lena Crow', craft: 'Beadwork', nation: 'Ojibwe', works: 45, verified: true, image: 'L' },
  { name: 'Kai Montoya', craft: 'Digital Art', nation: 'Māori', works: 12, verified: false, image: 'K' },
  { name: 'Aiyana Yazzie', craft: 'Pottery', nation: 'Hopi', works: 28, verified: true, image: 'A' },
  { name: 'Tala Redbird', craft: 'Jewelry', nation: 'Cherokee', works: 56, verified: true, image: 'T' },
  { name: 'Dakota White', craft: 'Photography', nation: 'Blackfoot', works: 89, verified: true, image: 'D' },
];

export default function ArtistsDirectory() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      paddingBottom: '100px'
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
          }}>Artists</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>Directory</p>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: '16px 24px' }}>
        <div style={{
          background: '#2A2A2A',
          borderRadius: '24px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search artists by name, craft, or nation..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{
        padding: '0 24px 16px',
        display: 'flex',
        gap: '10px',
        overflowX: 'auto'
      }}>
        <FilterPill label="All" active />
        <FilterPill label="Weavers" />
        <FilterPill label="Painters" />
        <FilterPill label="Carvers" />
        <FilterPill label="Digital" />
        <FilterPill label="Beadwork" />
      </div>

      {/* Artists Grid */}
      <main style={{ padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {artists.map((artist) => (
            <Link 
              key={artist.name} 
              href={`/artist/${artist.name.toLowerCase().replace(' ', '-')}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: '#2A2A2A',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '32px',
                  fontWeight: '600',
                  position: 'relative'
                }}>
                  {artist.image}
                  {artist.verified && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#FDB910',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {artist.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                  {artist.craft}
                </p>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 8px 0' }}>
                  {artist.nation}
                </p>
                <p style={{ fontSize: '12px', color: '#FDB910', margin: 0 }}>
                  {artist.works} works
                </p>
              </div>
            </Link>
          ))}
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
        <NavIcon icon="🏠" label="Home" href="/market" />
        <NavIcon icon="🔍" label="Browse" active />
        <Link href="/seva" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#6B7280'
          }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span style={{ fontSize: '10px' }}>Seva</span>
          </button>
        </Link>
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

function NavIcon({ icon, label, href, active }: { icon: string; label: string; href?: string; active?: boolean }) {
  const content = (
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

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
}
