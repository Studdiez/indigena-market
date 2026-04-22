'use client';

import Link from 'next/link';

const items = [
  { title: 'Handwoven Basket', price: 85, image: '🧺', artist: 'Maria' },
  { title: 'Ceramic Pot', price: 120, image: '🏺', artist: 'Aiyana' },
  { title: 'Leather Bag', price: 200, image: '👜', artist: 'Tala' },
  { title: 'Wool Scarf', price: 65, image: '🧣', artist: 'Maria' },
  { title: 'Wooden Bowl', price: 95, image: '🥣', artist: 'Eli' },
  { title: 'Beaded Earrings', price: 45, image: '💎', artist: 'Lena' },
];

export default function PhysicalItems() {
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
          }}>Physical Items</h1>
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
          <FilterPill label="Textiles" />
          <FilterPill label="Pottery" />
          <FilterPill label="Jewelry" />
          <FilterPill label="Woodwork" />
          <FilterPill label="Leather" />
        </div>
      </section>

      {/* Items Grid */}
      <main style={{ padding: '0 24px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {items.map((item) => (
            <Link 
              key={item.title} 
              href={`/market/nft/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: '#2A2A2A',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {item.image}
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
                  }}>{item.title}</p>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '12px',
                    color: '#9CA3AF'
                  }}>{item.artist}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FDB910'
                  }}>${item.price}</p>
                </div>
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
