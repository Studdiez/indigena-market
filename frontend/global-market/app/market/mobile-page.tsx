'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomSheet } from '@/components/mobile/BottomSheet';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { SkeletonCard } from '@/components/mobile/SkeletonCard';

const featuredArtists = [
  { name: 'Maria', craft: 'Weaver', image: 'M' },
  { name: 'Eli', craft: 'Carver', image: 'E' },
  { name: 'Sam', craft: 'Painter', image: 'S' },
  { name: 'Lena', craft: 'Bead', image: 'L' },
  { name: 'Kai', craft: 'Digital', image: 'K' },
];

const newThisWeek = [
  { title: 'Serpent Spirit', price: 45, image: '🐍' },
  { title: 'Sacred Cycle', price: 120, image: '⭕' },
  { title: 'Sunrise Realm', price: 65, image: '🌅' },
  { title: 'Earth Mother', price: 90, image: '🌍' },
];

const categories = [
  { name: 'Digital Art', icon: '🎨', href: '/market/digital-art' },
  { name: 'Physical', icon: '🧶', href: '/market/physical-items' },
  { name: 'Courses', icon: '📚', href: '/market/courses' },
  { name: 'Services', icon: '🛠️', href: '/market/services' },
  { name: 'Tourism', icon: '🌄', href: '/market/tourism' },
];

export default function GlobalMarketMobile() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      paddingBottom: '90px'
    }}>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Native App Header */}
        <header style={{
          padding: '12px 16px',
          background: '#1A1A1A',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            {/* Logo */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              </svg>
            </div>
            
            {/* Search Bar */}
            <div 
              onClick={() => {}}
              style={{
                flex: 1,
                background: '#2A2A2A',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span style={{ color: '#6B7280', fontSize: 15 }}>Search art, artists...</span>
            </div>
            
            {/* Profile */}
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#2A2A2A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Card */}
          <section style={{ padding: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
              borderRadius: 20,
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(253, 185, 16, 0.1)'
              }} />
              <p style={{
                fontSize: 22,
                fontWeight: 600,
                margin: '0 0 8px 0',
                lineHeight: 1.3
              }}>Discover Indigenous Art</p>
              <p style={{
                fontSize: 14,
                opacity: 0.8,
                margin: '0 0 20px 0'
              }}>Support artists directly. Every purchase matters.</p>
              <Link href="/market/digital-art">
                <button style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#FDB910',
                  color: '#1A1A1A',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Explore
                </button>
              </Link>
            </div>
          </section>

          {/* Categories - Horizontal Scroll */}
          <section style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              padding: '0 16px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 72
                  }}>
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: '#2A2A2A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28
                    }}>
                      {cat.icon}
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Artists */}
          <section style={{ padding: '0 16px', marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Featured Artists</h2>
              <Link href="/artists" style={{ color: '#B51D19', fontSize: 14, textDecoration: 'none' }}>
                See All
              </Link>
            </div>
            
            <div style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              paddingBottom: 8
            }}>
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} style={{ minWidth: 100 }}>
                    <SkeletonCard />
                  </div>
                ))
              ) : (
                featuredArtists.map((artist) => (
                  <Link key={artist.name} href="/artist/maria-begay" style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 80
                    }}>
                      <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 600
                      }}>
                        {artist.image}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{artist.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>{artist.craft}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* New This Week */}
          <section style={{ padding: '0 16px', marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>New This Week</h2>
              <button 
                onClick={() => setIsFilterOpen(true)}
                style={{
                  background: '#2A2A2A',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                Filter ▼
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12
            }}>
              {isLoading ? (
                [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
              ) : (
                newThisWeek.map((item) => (
                  <Link key={item.title} href="/market/nft/navajo-weaving" style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#2A2A2A',
                      borderRadius: 16,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        aspectRatio: '1',
                        background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 48
                      }}>
                        {item.image}
                      </div>
                      <div style={{ padding: 12 }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontSize: 14,
                          fontWeight: 500
                        }}>{item.title}</p>
                        <p style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#FDB910'
                        }}>${item.price}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* SEVA Spotlight */}
          <section style={{ padding: '0 16px 100px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              borderRadius: 20,
              padding: 20,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>SEVA Spotlight</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>
                Maasai Women's Center
              </h3>
              <p style={{ fontSize: 14, opacity: 0.9, margin: '0 0 16px 0' }}>
                Building a safe space for women to learn traditional crafts
              </p>
              <div style={{
                height: 6,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 3,
                marginBottom: 8,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '74%',
                  height: '100%',
                  background: '#FDB910',
                  borderRadius: 3
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>74% to goal</span>
                <Link href="/seva">
                  <button style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'white',
                    color: '#B51D19',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    Support
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </PullToRefresh>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="🔍" 
        href="/market/digital-art"
        color="accent"
      />

      {/* Filter Bottom Sheet */}
      <BottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        title="Filter By"
        height="medium"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['All', 'Digital Art', 'Physical Items', 'Courses', 'Services', 'Tourism'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveCategory(filter);
                setIsFilterOpen(false);
              }}
              style={{
                padding: '16px',
                borderRadius: 12,
                border: 'none',
                background: activeCategory === filter ? '#B51D19' : '#2A2A2A',
                color: 'white',
                fontSize: 16,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {filter}
              {activeCategory === filter && <span>✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Tab Bar - iOS Style */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '8px 0 24px',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 100
      }}>
        <TabIcon icon="🏠" label="Home" href="/market" active />
        <TabIcon icon="🔍" label="Browse" href="/artists" />
        <TabIcon icon="⚡" label="Seva" href="/seva" />
        <TabIcon icon="❤️" label="Saved" href="/saved" />
        <TabIcon icon="👤" label="Profile" href="/profile" />
      </nav>
    </div>
  );
}

function TabIcon({ icon, label, href, active }: { icon: string; label: string; href?: string; active?: boolean }) {
  const content = (
    <button style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      padding: '4px 12px',
      color: active ? '#B51D19' : '#6B7280',
      transition: 'color 0.2s'
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
    </button>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
}
