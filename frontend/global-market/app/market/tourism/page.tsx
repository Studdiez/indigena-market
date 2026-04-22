'use client';

import Link from 'next/link';

const experiences = [
  { title: 'Sacred Canyon Tour', price: 150, image: '🏜️', location: 'Navajo Nation', duration: '4 hours', rating: 4.9 },
  { title: 'Traditional Pottery Workshop', price: 85, image: '🏺', location: 'Hopi Village', duration: '3 hours', rating: 5.0 },
  { title: 'Sunrise Ceremony', price: 200, image: '🌅', location: 'Lakota Territory', duration: '2 hours', rating: 4.8 },
  { title: 'Forest Medicine Walk', price: 75, image: '🌲', location: 'Ojibwe Lands', duration: '3 hours', rating: 4.9 },
  { title: 'Storytelling Evening', price: 50, image: '🔥', location: 'Haida Gwaii', duration: '2 hours', rating: 5.0 },
  { title: 'Traditional Feast', price: 120, image: '🍲', location: 'Pueblo Village', duration: '4 hours', rating: 4.7 },
];

export default function Tourism() {
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
          }}>Tourism</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>Experiences</p>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{
        margin: '16px 24px',
        padding: '24px',
        background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '32px', margin: '0 0 8px 0' }}>🌎</p>
        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Cultural Tourism</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
          Experience authentic indigenous culture with local guides and community hosts
        </p>
      </div>

      {/* Experiences List */}
      <main style={{ padding: '0 24px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {experiences.map((exp) => (
            <div key={exp.title} style={{
              background: '#2A2A2A',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer'
            }}>
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                {exp.image}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{exp.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#FDB910' }}>★</span>
                    <span style={{ fontSize: '14px', color: '#FDB910' }}>{exp.rating}</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9CA3AF' }}>📍 {exp.location}</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>⏱️ {exp.duration}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#FDB910' }}>${exp.price}</p>
                  <button style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
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
