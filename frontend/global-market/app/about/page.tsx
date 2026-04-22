'use client';

import Link from 'next/link';

const values = [
  { icon: '🤝', title: 'Community First', description: 'Every decision prioritizes the wellbeing of indigenous communities' },
  { icon: '⚖️', title: 'Fair Trade', description: 'Artists keep 70-85% of every sale, the highest in the industry' },
  { icon: '🌱', title: 'Sustainable', description: 'Built for long-term community wealth, not short-term profit' },
  { icon: '🔒', title: 'Cultural Protection', description: 'Sacred knowledge is protected and respected' },
];

const team = [
  { name: 'Sarah Redbird', role: 'Founder & CEO', image: 'S' },
  { name: 'Michael Two Hawks', role: 'Community Director', image: 'M' },
  { name: 'Elena Whitehorse', role: 'Artist Relations', image: 'E' },
];

export default function About() {
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
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>About Us</h1>
      </header>

      {/* Hero */}
      <section style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 16px 0' }}>
          Indigena Market
        </h2>
        <p style={{ color: '#9CA3AF', margin: '0 auto 24px', lineHeight: '1.8', maxWidth: '500px' }}>
          A marketplace built by and for indigenous communities. We believe in ethical trade, 
          cultural preservation, and community wealth building.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: '0 24px 40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
          borderRadius: '16px',
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🌎</p>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 12px 0' }}>Our Mission</h3>
          <p style={{ margin: 0, lineHeight: '1.7', fontSize: '15px' }}>
            To create a global marketplace where indigenous artists can share their culture, 
            preserve their traditions, and build sustainable livelihoods—while ensuring their 
            sacred knowledge remains protected and respected.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '0 24px 40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', textAlign: 'center' }}>
          Our Values
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {values.map((value) => (
            <div key={value.title} style={{
              background: '#2A2A2A',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              <div style={{ fontSize: '32px' }}>{value.icon}</div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>{value.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.5' }}>
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 24px 100px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', textAlign: 'center' }}>
          Our Team
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {team.map((member) => (
            <div key={member.name} style={{
              background: '#2A2A2A',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                {member.image}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>{member.name}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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
