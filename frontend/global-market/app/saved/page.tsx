'use client';

import { useState } from 'react';
import Link from 'next/link';

const savedItems = [
  { title: 'Navajo Weaving', price: 450, image: '🧶', artist: 'Maria Begay', type: 'nft' },
  { title: 'Sacred Cycle', price: 120, image: '⭕', artist: 'Eli Whittaker', type: 'nft' },
  { title: 'Dream Walker', price: 89, image: '🌙', artist: 'Sam Blackhorse', type: 'nft' },
];

const savedArtists = [
  { name: 'Maria Begay', craft: 'Weaver', image: 'M' },
  { name: 'Eli Whittaker', craft: 'Carver', image: 'E' },
];

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState<'items' | 'artists'>('items');

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
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Saved</h1>
      </header>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333'
      }}>
        <button
          onClick={() => setActiveTab('items')}
          style={{
            flex: 1,
            padding: '16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'items' ? '2px solid #B51D19' : 'none',
            color: activeTab === 'items' ? 'white' : '#6B7280',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Items ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('artists')}
          style={{
            flex: 1,
            padding: '16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'artists' ? '2px solid #B51D19' : 'none',
            color: activeTab === 'artists' ? 'white' : '#6B7280',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Artists ({savedArtists.length})
        </button>
      </div>

      {/* Content */}
      <main style={{ padding: '24px', paddingBottom: '100px' }}>
        {activeTab === 'items' ? (
          savedItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {savedItems.map((item) => (
                <Link key={item.title} href={`/market/nft/${item.title.toLowerCase().replace(' ', '-')}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#2A2A2A',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px'
                    }}>
                      {item.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{item.title}</h3>
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9CA3AF' }}>{item.artist}</p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#FDB910' }}>${item.price}</p>
                    </div>
                    <button style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#B51D19',
                      color: 'white',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}>
                      ❤️
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="❤️"
              title="No saved items yet"
              message="Your collection is waiting. Start exploring to find art that speaks to you."
              actionText="Explore Art"
              actionHref="/market"
            />
          )
        ) : (
          savedArtists.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {savedArtists.map((artist) => (
                <Link key={artist.name} href={`/artist/${artist.name.toLowerCase().replace(' ', '-')}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#2A2A2A',
                    borderRadius: '12px',
                    padding: '16px',
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
                      fontSize: '28px',
                      fontWeight: '600'
                    }}>
                      {artist.image}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{artist.name}</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>{artist.craft}</p>
                    </div>
                    <button style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#B51D19',
                      color: 'white',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}>
                      ❤️
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="👤"
              title="No saved artists yet"
              message="Follow artists to see their latest work in your feed."
              actionText="Discover Artists"
              actionHref="/artists"
            />
          )
        )}
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
        <NavIcon icon="❤️" label="Saved" active />
      </nav>
    </div>
  );
}

function EmptyState({ icon, title, message, actionText, actionHref }: {
  icon: string;
  title: string;
  message: string;
  actionText: string;
  actionHref: string;
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '16px'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>{title}</h3>
      <p style={{ color: '#9CA3AF', margin: '0 0 24px 0', lineHeight: '1.6' }}>{message}</p>
      <Link href={actionHref} style={{ textDecoration: 'none' }}>
        <button style={{
          padding: '16px 32px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          {actionText}
        </button>
      </Link>
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
