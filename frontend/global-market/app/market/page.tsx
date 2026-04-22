'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Metallic Gold Gradient
const goldGradient = 'linear-gradient(135deg, #FDB910 0%, #FFD700 25%, #FDB910 50%, #D4A574 75%, #FDB910 100%)';
const goldTextStyle = {
  background: 'linear-gradient(135deg, #FDB910 0%, #FFD700 30%, #FFF8DC 50%, #FDB910 70%, #D4A574 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

// SVG Icons for the 10 pillars with metallic gold fill
const PillarIcon = ({ type }: { type: string }) => {
  const gradientId = `goldGradient-${type}`;
  
  return (
    <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDB910" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFF8DC" />
          <stop offset="75%" stopColor="#FDB910" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
      </defs>
      {getIconPath(type, gradientId)}
    </svg>
  );
};

const getIconPath = (type: string, gradientId: string) => {
  const fill = `url(#${gradientId})`;
  const stroke = `url(#${gradientId})`;
  
  switch (type) {
    case 'digital':
      return <path d="M7 3h10l-3 7h4L8 21l2-8H5L7 3z" fill={fill} stroke="none" />;
    case 'physical':
      return (
        <>
          <rect x="4" y="5" width="16" height="14" rx="1" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M4 10h16M9 21V10" stroke={stroke} strokeWidth="1.5" fill="none" />
        </>
      );
    case 'courses':
      return (
        <>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
    case 'freelancing':
      return (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="9" cy="7" r="4" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
    case 'seva':
      return <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={fill} stroke="none" />;
    case 'tourism':
      return (
        <>
          <path d="M14 10l-2 4-2-4-4-2 4-2 2-4 2 4 4 2-4 2z" fill={fill} stroke="none" />
          <path d="M3 21h18" stroke={stroke} strokeWidth="1.5" fill="none" />
        </>
      );
    case 'heritage':
      return (
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 6h3M8 10h6" stroke={stroke} strokeWidth="1.5" fill="none" />
          <text x="14" y="10" fill={fill} stroke="none" fontSize="6">文</text>
        </>
      );
    case 'land':
      return (
        <>
          <path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z" fill={fill} stroke="none" />
          <circle cx="12" cy="14" r="2" fill={stroke} stroke="none" />
        </>
      );
    case 'advocacy':
      return (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M9 12l2 2 4-4" fill="none" stroke={stroke} strokeWidth="1.5" />
        </>
      );
    case 'materials':
      return (
        <>
          <circle cx="12" cy="12" r="3" fill={fill} stroke="none" />
          <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.8 17.8l-4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1" stroke={stroke} strokeWidth="1.5" fill="none" />
        </>
      );
    default:
      return <path d="M12 2L2 12l10 10 10-10L12 2z" fill={fill} stroke="none" />;
  }
};

const pillars = [
  { name: 'DIGITAL ARTS', type: 'digital', href: '/market/digital-art' },
  { name: 'PHYSICAL ITEMS', type: 'physical', href: '/market/physical-items' },
  { name: 'COURSES', type: 'courses', href: '/market/courses' },
  { name: 'FREELANCING', type: 'freelancing', href: '/market/services' },
  { name: 'SEVA GIVING', type: 'seva', href: '/seva' },
  { name: 'CULTURAL TOURISM', type: 'tourism', href: '/market/tourism' },
  { name: 'HERITAGE', type: 'heritage', href: '/market/language' },
  { name: 'LAND & FOOD', type: 'land', href: '/market/land' },
  { name: 'ADVOCACY', type: 'advocacy', href: '/market/advocacy' },
  { name: 'MATERIALS', type: 'materials', href: '/market/materials' },
];

const featuredArtists = [
  {
    name: 'Awichas',
    nation: 'Aymara Nation',
    description: 'Woven treasures of carved enchers',
    price: 120,
    image: '/artists/awichas.jpg',
    fallback: '👵'
  },
  {
    name: 'Maria',
    nation: 'Navajo Nation',
    description: 'Modern allicant worned hand-cared mass',
    price: 350,
    image: '/artists/maria.jpg',
    fallback: '🪶'
  }
];

const featuredArtworks = [
  { title: 'Turquoise Necklace', price: 120, image: '/artworks/necklace.jpg', fallback: '📿' },
  { title: 'Clay Pot', price: 120, image: '/artworks/pot.jpg', fallback: '🏺' },
  { title: 'Dreamcatcher', price: 350, image: '/artworks/dreamcatcher.jpg', fallback: '🪶' },
  { title: 'Beaded Earrings', price: 150, image: '/artworks/earrings.jpg', fallback: '💎' },
];

const gallery = [
  { title: 'Woven Basket', price: 180, image: '/gallery/basket.jpg', fallback: '🧺' },
  { title: 'Clay Pot', price: 250, image: '/gallery/pot2.jpg', fallback: '🏺' },
  { title: 'Textile Rug', price: 120, image: '/gallery/rug.jpg', fallback: '🧶' },
  { title: 'Feather Art', price: 475, image: '/gallery/feather.jpg', fallback: '🪶' },
  { title: 'Ceramic Bowl', price: 90, image: '/gallery/bowl.jpg', fallback: '🥣' },
  { title: 'Beadwork', price: 220, image: '/gallery/beadwork.jpg', fallback: '📿' },
];

export default function GlobalMarket() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#151515',
      backgroundImage: `
        url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
        radial-gradient(ellipse at 50% 0%, rgba(181, 29, 25, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse at 20% 40%, rgba(253, 185, 16, 0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 60%, rgba(181, 29, 25, 0.06) 0%, transparent 50%),
        linear-gradient(180deg, #1a1815 0%, #0f0e0d 100%)
      `,
      backgroundBlendMode: 'overlay, normal, normal, normal, normal',
      color: 'white',
      fontFamily: '"Georgia", "Times New Roman", serif',
      paddingBottom: '100px'
    }}>
      {/* Side Navigation Drawer */}
      {isSideNavOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
          display: 'flex'
        }}>
          <div 
            onClick={() => setIsSideNavOpen(false)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.85)' }}
          />
          <div style={{
            width: 300,
            backgroundColor: '#1a1815',
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
              linear-gradient(180deg, #1a1815 0%, #0f0e0d 100%)
            `,
            backgroundBlendMode: 'overlay, normal',
            borderRight: '1px solid rgba(181, 29, 25, 0.25)',
            padding: '28px 0',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '0 28px 28px', textAlign: 'center', borderBottom: '1px solid rgba(181, 29, 25, 0.2)', marginBottom: 20 }}>
              <div style={{ width: 90, height: 90, margin: '0 auto 16px', position: 'relative' }}>
                <Image src="/logo.png" alt="Indigena Market" fill style={{ objectFit: 'contain' }} />
              </div>
              <p style={{ margin: 0, fontSize: 22, fontStyle: 'italic', fontFamily: '"Brush Script MT", cursive', ...goldTextStyle }}>10 Pillars</p>
            </div>
            <nav>
              {pillars.map((pillar) => (
                <Link key={pillar.name} href={pillar.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '16px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #B51D19 0%, #8B0000 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(181, 29, 25, 0.35)'
                    }}>
                      <PillarIcon type={pillar.type} />
                    </div>
                    <span style={{ fontSize: 16, color: 'white', fontWeight: 400, letterSpacing: '0.5px' }}>{pillar.name}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={() => setIsSideNavOpen(true)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(181, 29, 25, 0.35)',
            background: 'rgba(181, 29, 25, 0.12)',
            color: '#B51D19',
            fontSize: 20,
            cursor: 'pointer'
          }}
        >☰</button>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(181, 29, 25, 0.35)',
            background: 'rgba(181, 29, 25, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B51D19',
            fontSize: 18,
            fontWeight: 600
          }}>J</div>
        </Link>
      </header>

      {/* Logo Section - BIGGER */}
      <section style={{ textAlign: 'center', padding: '12px 24px 32px' }}>
        <div style={{ width: 140, height: 140, margin: '0 auto 20px', position: 'relative' }}>
          <Image src="/logo.png" alt="Indigena Market" fill style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: '7px',
          color: '#B51D19',
          textTransform: 'uppercase',
          fontFamily: '"Times New Roman", serif',
          textShadow: '0 2px 12px rgba(181, 29, 25, 0.35)'
        }}>INDIGENA MARKET</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 12 }}>
          <div style={{ width: 70, height: 2, background: goldGradient }} />
          <p style={{
            margin: 0,
            fontSize: 28,
            fontStyle: 'italic',
            fontFamily: '"Brush Script MT", cursive',
            ...goldTextStyle
          }}>Marketplace</p>
          <div style={{ width: 70, height: 2, background: goldGradient }} />
        </div>
      </section>

      {/* The Ten Pillars - BIGGER & ALIGNED WITH FEATURED ART */}
      <section style={{ padding: '28px 20px 32px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 16,
          letterSpacing: '5px',
          color: '#B51D19',
          textTransform: 'uppercase',
          margin: '0 0 28px 0',
          fontWeight: 500
        }}>THE TEN PILLARS</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px 10px',
          maxWidth: 420,
          margin: '0 auto'
        }}>
          {pillars.map((pillar) => (
            <Link key={pillar.name} href={pillar.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #B51D19 0%, #8B0000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(181, 29, 25, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  <PillarIcon type={pillar.type} />
                </div>
                <span style={{
                  fontSize: 9,
                  color: '#aaa',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                  maxWidth: 75,
                  fontWeight: 400
                }}>{pillar.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Artist Section - LARGE */}
      <section style={{ padding: '28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{
            fontSize: 18,
            letterSpacing: '5px',
            color: '#B51D19',
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 500
          }}>FEATURED ARTIST</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <div style={{ width: 40, height: 2, background: goldGradient }} />
            <p style={{
              margin: 0,
              fontSize: 20,
              fontStyle: 'italic',
              fontFamily: '"Brush Script MT", cursive',
              ...goldTextStyle
            }}>Artist of the Month</p>
            <div style={{ width: 40, height: 2, background: goldGradient }} />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16
        }}>
          {featuredArtists.map((artist) => (
            <div key={artist.name} style={{
              borderRadius: 20,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                aspectRatio: '3/4.5',
                background: 'linear-gradient(145deg, #3d3028 0%, #1a1512 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 120,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src={artist.image} 
                  alt={artist.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size: 120px;">${artist.fallback}</span>`;
                    }
                  }}
                />
                {/* Gold price tag */}
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  padding: '8px 18px',
                  background: goldGradient,
                  borderRadius: 24,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}>
                  <span style={{ color: '#1a1512', fontSize: 16, fontWeight: 700 }}>${artist.price}</span>
                </div>
              </div>
              {/* Text overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '100px 20px 20px',
                background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.9) 50%)'
              }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 24, color: 'white', fontWeight: 500, letterSpacing: '0.5px' }}>{artist.name}</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: 15, ...goldTextStyle, fontStyle: 'italic' }}>{artist.nation}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{artist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artwork Section */}
      <section style={{ padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{
              fontSize: 18,
              letterSpacing: '5px',
              color: '#B51D19',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 500
            }}>FEATURED ARTWORK</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              <div style={{ width: 40, height: 2, background: goldGradient }} />
              <p style={{
                margin: 0,
                fontSize: 20,
                fontStyle: 'italic',
                fontFamily: '"Brush Script MT", cursive',
                ...goldTextStyle
              }}>Curated for you</p>
              <div style={{ width: 40, height: 2, background: goldGradient }} />
            </div>
          </div>
          <button style={{
            padding: '10px 20px',
            borderRadius: 20,
            border: `1px solid #FDB910`,
            background: 'transparent',
            color: '#FDB910',
            fontSize: 14,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>View All</button>
        </div>

        {/* 4 cards in a row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14
        }}>
          {featuredArtworks.map((art) => (
            <div key={art.title} style={{
              borderRadius: 16,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              boxShadow: '0 6px 24px rgba(0,0,0,0.4)'
            }}>
              <div style={{
                aspectRatio: '1',
                background: 'linear-gradient(145deg, #3d3028 0%, #1a1512 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 50,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src={art.image} 
                  alt={art.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size: 50px;">${art.fallback}</span>`;
                    }
                  }}
                />
              </div>
              {/* Gold price tag */}
              <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                padding: '6px 14px',
                background: goldGradient,
                borderRadius: 20,
                boxShadow: '0 3px 10px rgba(0,0,0,0.4)'
              }}>
                <span style={{ color: '#1a1512', fontSize: 14, fontWeight: 700 }}>${art.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section style={{ padding: '28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 2, background: goldGradient }} />
            <p style={{
              fontSize: 18,
              letterSpacing: '5px',
              color: '#B51D19',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 500
            }}>GALLERY</p>
            <div style={{ width: 40, height: 2, background: goldGradient }} />
          </div>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: 20,
            fontStyle: 'italic',
            fontFamily: '"Brush Script MT", cursive',
            ...goldTextStyle
          }}>Browse all</p>
        </div>

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16
        }}>
          {gallery.map((item) => (
            <div key={item.title} style={{
              borderRadius: 16,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              boxShadow: '0 6px 24px rgba(0,0,0,0.4)'
            }}>
              <div style={{
                aspectRatio: '1',
                background: 'linear-gradient(145deg, #3d3028 0%, #1a1512 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 56,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span style="font-size: 56px;">${item.fallback}</span>`;
                    }
                  }}
                />
              </div>
              {/* Gold price tag */}
              <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                padding: '6px 14px',
                background: goldGradient,
                borderRadius: 20,
                boxShadow: '0 3px 10px rgba(0,0,0,0.4)'
              }}>
                <span style={{ color: '#1a1512', fontSize: 14, fontWeight: 700 }}>${item.price}</span>
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
        background: 'linear-gradient(0deg, #0a0909 0%, rgba(15,14,13,0.98) 100%)',
        borderTop: '1px solid rgba(181, 29, 25, 0.25)',
        padding: '16px 48px 32px',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <NavIcon icon="🏠" active />
        <NavIcon icon="🔍" />
        <NavIcon icon="❤️" />
        <NavIcon icon="👤" />
      </nav>
    </div>
  );
}

function NavIcon({ icon, active }: { icon: string; active?: boolean }) {
  return (
    <button style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 30,
      opacity: active ? 1 : 0.5,
      filter: active ? 'drop-shadow(0 0 12px rgba(181, 29, 25, 0.7))' : 'none',
      transition: 'all 0.2s',
      padding: '6px'
    }}>
      {icon}
    </button>
  );
}
