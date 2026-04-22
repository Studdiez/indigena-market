'use client';

import Link from 'next/link';

const menuItems = [
  { icon: '🛍️', label: 'My Orders', href: '#' },
  { icon: '❤️', label: 'Saved Items', href: '/saved' },
  { icon: '💳', label: 'Payment Methods', href: '#' },
  { icon: '📍', label: 'Addresses', href: '#' },
  { icon: '🔔', label: 'Notifications', href: '#' },
  { icon: '⚙️', label: 'Settings', href: '#' },
  { icon: '❓', label: 'Help & Support', href: '/contact' },
  { icon: '📄', label: 'About', href: '/about' },
];

const stats = [
  { label: 'Orders', value: 12 },
  { label: 'Saved', value: 8 },
  { label: 'Following', value: 24 },
];

export default function Profile() {
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
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Profile</h1>
      </header>

      {/* Profile Info */}
      <section style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '40px',
          fontWeight: '600'
        }}>
          J
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>John Doe</h2>
        <p style={{ color: '#9CA3AF', margin: '0 0 16px 0' }}>john.doe@email.com</p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(253, 185, 16, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          <span>🌳</span>
          <span style={{ fontSize: '14px', color: '#FDB910', fontWeight: '600' }}>Tree Member</span>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '20px',
          background: '#2A2A2A',
          borderRadius: '12px'
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', color: '#FDB910' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Card */}
      <section style={{ padding: '0 24px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>💚</span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Your Impact</h3>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>You\'ve supported 12 indigenous artists</p>
            </div>
          </div>
          <div style={{
            height: '8px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: '#FDB910',
              borderRadius: '4px'
            }} />
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>$450 contributed to communities</p>
        </div>
      </section>

      {/* Menu */}
      <main style={{ padding: '0 24px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#2A2A2A',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ flex: 1, color: 'white', fontSize: '15px' }}>{item.label}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button style={{
          width: '100%',
          padding: '16px',
          marginTop: '24px',
          borderRadius: '12px',
          border: '1px solid #B51D19',
          background: 'transparent',
          color: '#B51D19',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Log Out
        </button>
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
        <NavIcon icon="👤" label="Profile" active />
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
