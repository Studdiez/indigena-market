'use client';

import Link from 'next/link';

const artistWorks = [
  { title: 'Navajo Weaving', price: 450, image: '🧶', sold: false },
  { title: 'Serpent Spirit', price: 120, image: '🐍', sold: true },
  { title: 'Sacred Cycle', price: 89, image: '⭕', sold: false },
  { title: 'Earth Prayer', price: 200, image: '🌍', sold: false },
];

export default function ArtistProfile() {
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
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Artist Profile</h1>
      </header>

      {/* Artist Info */}
      <div style={{ padding: '24px' }}>
        {/* Avatar & Name */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '48px',
            fontWeight: '600'
          }}>
            M
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Maria Begay</h2>
          <p style={{ color: '#9CA3AF', margin: '0 0 8px 0' }}>Diné (Navajo) Nation</p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(253, 185, 16, 0.2)',
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            <span>✓</span>
            <span style={{ fontSize: '12px', color: '#FDB910' }}>Verified Artist</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '20px',
          background: '#2A2A2A',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#FDB910' }}>24</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Works</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#FDB910' }}>156</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Sales</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#FDB910' }}>4.9</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Rating</p>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>About</h3>
          <p style={{ color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>
            Fourth-generation weaver from the Navajo Nation. I learned the art of weaving from my grandmother, 
            who learned from hers. Each piece carries the stories and prayers of my ancestors. 
            My work has been featured in museums across the Southwest.
          </p>
        </div>

        {/* Artist's Works */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>Available Works</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {artistWorks.map((work) => (
            <Link key={work.title} href={`/market/nft/${work.title.toLowerCase().replace(' ', '-')}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#2A2A2A',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                opacity: work.sold ? 0.6 : 1
              }}>
                <div style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {work.image}
                </div>
                {work.sold && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#1A1A1A',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    SOLD
                  </div>
                )}
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: 'white' }}>{work.title}</p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#FDB910' }}>${work.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Community Impact */}
        <div style={{
          background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>Community Impact</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            Maria has contributed <span style={{ color: '#FDB910', fontWeight: '600' }}>$12,450</span> to the Navajo Weaving Center
          </p>
          <div style={{
            height: '8px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '75%',
              height: '100%',
              background: '#FDB910',
              borderRadius: '4px'
            }} />
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>75% to goal of $25,000</p>
        </div>

        {/* Follow Button */}
        <button style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          border: '2px solid #B51D19',
          background: 'transparent',
          color: '#B51D19',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Follow Artist
        </button>
      </div>

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
        <NavIcon icon="🔍" label="Browse" />
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

      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }} />
    </div>
  );
}

function NavIcon({ icon, label, href }: { icon: string; label: string; href?: string }) {
  const content = (
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
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '10px' }}>{label}</span>
    </button>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
}
