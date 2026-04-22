'use client';

import Link from 'next/link';

export default function CreatorHub() {
  const walletBalance = 1247.50;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Offline Banner */}
      <div style={{
        background: '#2A2A2A',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #333'
      }}>
        <span style={{ fontSize: '16px' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>OFFLINE</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9CA3AF' }}>
            Your work is saved. Will upload when connected.
          </p>
        </div>
        <button style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: '#4B5563',
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer'
        }}>
          OK
        </button>
      </div>

      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Welcome, Aiyana!</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9CA3AF' }}>Diné (Navajo) Nation</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Online/Offline Indicator */}
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#EF4444',
            boxShadow: '0 0 8px #EF4444'
          }} title="Offline" />
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: '#2A2A2A',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Wallet Card */}
        <div style={{
          background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
            </svg>
            <span style={{ color: '#9CA3AF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Wallet</span>
          </div>
          <p style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: '8px 0',
            color: 'white'
          }}>${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <button style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '8px'
          }}>
            Withdraw
          </button>
        </div>

        {/* Action Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <ActionButton icon="➕" label="Add New" href="/creator/add" color="red" />
          <ActionButton icon="📦" label="My List" href="/creator/items" color="gray" />
          <ActionButton icon="💰" label="Sales" href="/creator/sales" color="gray" />
          <ActionButton icon="🎓" label="My Courses" href="/creator/courses" color="gray" />
          <ActionButton icon="🛠️" label="Tools" href="/creator/tools" color="gray" />
          <ActionButton icon="❓" label="Help" href="/creator/help" color="gray" />
        </div>

        {/* Voice Shortcut */}
        <Link href="/creator/add" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '20px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '20px' }}>🎙️</span>
            RECORD NEW ITEM
          </button>
        </Link>

        {/* Drafts Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>☁️</span> Drafts (Waiting to upload)
          </h2>
          
          <div style={{
            background: '#2A2A2A',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px dashed #4B5563'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              🧶
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '500' }}>Navajo Weaving</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>$450 • Story recorded</p>
            </div>
            <span style={{ fontSize: '20px', color: '#6B7280' }}>☁️</span>
          </div>
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
        <NavIcon icon="🏠" label="Home" active />
        <NavIcon icon="🔍" label="Search" />
        <NavIcon icon="❤️" label="Favorites" />
        <NavIcon icon="👤" label="Profile" />
      </nav>

      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }} />
    </div>
  );
}

function ActionButton({ icon, label, href, color }: { icon: string; label: string; href: string; color: 'red' | 'gray' }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: color === 'red' ? 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)' : '#2A2A2A',
        borderRadius: '12px',
        padding: '16px 8px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'white',
          fontWeight: '500'
        }}>{label}</p>
      </div>
    </Link>
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
