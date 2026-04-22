'use client';

import Link from 'next/link';

const tiers = [
  {
    name: 'Seed',
    price: 5,
    period: 'month',
    features: ['Monthly newsletter', 'Early access to new art', 'Member badge'],
    color: '#6B7280'
  },
  {
    name: 'Tree',
    price: 25,
    period: 'month',
    features: ['All Seed benefits', '10% discount on purchases', 'Exclusive member events', 'Direct artist messages'],
    color: '#2A5C2A',
    popular: true
  },
  {
    name: 'Forest',
    price: 100,
    period: 'month',
    features: ['All Tree benefits', '25% discount on purchases', 'Annual gift box', 'VIP event access', 'Name on community wall'],
    color: '#FDB910'
  },
];

const impact = [
  { number: '$2.8M', label: 'Raised for artists' },
  { number: '12,400', label: 'Active members' },
  { number: '156', label: 'Communities supported' },
  { number: '89%', label: 'Goes directly to creators' },
];

export default function CircleOfSupport() {
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
          }}>Circle of</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>Support</p>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '40px'
        }}>
          🌳
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px 0' }}>
          Join the Circle
        </h2>
        <p style={{ color: '#9CA3AF', margin: '0 0 24px 0', lineHeight: '1.6', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          Become a monthly supporter and help indigenous artists thrive while earning exclusive benefits
        </p>
      </section>

      {/* Impact Stats */}
      <section style={{ padding: '0 24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {impact.map((stat) => (
            <div key={stat.label} style={{
              background: '#2A2A2A',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', color: '#FDB910' }}>
                {stat.number}
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tiers */}
      <main style={{ padding: '0 24px 100px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0', textAlign: 'center' }}>
          Choose Your Tier
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tiers.map((tier) => (
            <div key={tier.name} style={{
              background: tier.popular ? 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)' : '#2A2A2A',
              borderRadius: '16px',
              padding: '24px',
              border: tier.popular ? '2px solid #FDB910' : 'none',
              position: 'relative'
            }}>
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: '#FDB910',
                  color: '#1A1A1A',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>{tier.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#FDB910' }}>${tier.price}</span>
                    <span style={{ fontSize: '14px', color: '#9CA3AF' }}>/{tier.period}</span>
                  </div>
                </div>
              </div>
              <ul style={{ margin: '0 0 20px 0', padding: 0, listStyle: 'none' }}>
                {tier.features.map((feature) => (
                  <li key={feature} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#FDB910' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: tier.popular ? '#FDB910' : 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                color: tier.popular ? '#1A1A1A' : 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Join {tier.name}
              </button>
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
