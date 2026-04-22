'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NFTDetail() {
  const [activeImage, setActiveImage] = useState(0);
  const [showSevaModal, setShowSevaModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number | null>(25);

  const images = ['🧶', '🎨', '🖼️'];
  
  const transparencyBreakdown = [
    { label: 'To the Artist', percentage: 70, amount: 315, color: '#FDB910', icon: '👤' },
    { label: 'Community Fund', percentage: 15, amount: 67.50, color: '#2A5C2A', icon: '🏘️' },
    { label: 'Seva Projects', percentage: 5, amount: 22.50, color: '#B51D19', icon: '⚡' },
    { label: 'Platform Fee', percentage: 10, amount: 45, color: '#6B7280', icon: '🏛️' },
  ];

  const sevaTiers = [
    { amount: 5, impact: 'Buys yarn for 3 weavers' },
    { amount: 15, impact: 'Buys a loom' },
    { amount: 25, impact: 'Builds a classroom' },
    { amount: 50, impact: 'Sponsors a student' },
  ];

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
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Digital Art Market</h1>
        <div style={{ flex: 1 }} />
        <button style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: '#2A2A2A',
          cursor: 'pointer'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ paddingBottom: '100px' }}>
        {/* Image Gallery */}
        <div style={{
          height: '320px',
          background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '120px',
          position: 'relative'
        }}>
          {images[activeImage]}
          
          {/* Image Dots */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: i === activeImage ? '#B51D19' : '#4B5563',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Title & Artist */}
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Navajo Weaving</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#9CA3AF' }}>Maria Begay</span>
              <span style={{ color: '#6B7280' }}>•</span>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Diné (Navajo) Nation</span>
            </div>
          </div>

          {/* Price */}
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#FDB910',
            margin: '0 0 24px 0'
          }}>$450.00</p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button style={{
              flex: 1,
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #333',
              background: '#2A2A2A',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Video
            </button>
            <AudioPlayerButton />
          </div>

          {/* Story Quote */}
          <div style={{
            background: '#2A2A2A',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            borderLeft: '4px solid #B51D19'
          }}>
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              color: '#E0E0E0',
              margin: '0 0 12px 0',
              lineHeight: '1.6'
            }}>"This rug tells the story of my grandmother's clan. The diamonds represent the four directions."</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF' }}>— Maria Begay</p>
          </div>

          {/* Transparency Breakdown */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Where Your Money Goes</h2>
            
            {/* Visual Bar */}
            <div style={{
              height: '32px',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '16px'
            }}>
              {transparencyBreakdown.map((item) => (
                <div
                  key={item.label}
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: item.color
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transparencyBreakdown.map((item) => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#2A2A2A',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{item.percentage}%</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: item.color }}>
                    ${item.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Add to Cart */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1A1A1A',
        borderTop: '1px solid #333',
        padding: '16px 24px',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={() => setShowSevaModal(true)}
          style={{
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid #FDB910',
            background: 'transparent',
            color: '#FDB910',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Gift
        </button>
        <Link href="/checkout" style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '16px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ADD TO CART — $450
          </button>
        </Link>
      </div>

      {/* Seva Modal */}
      {showSevaModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          zIndex: 100,
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => setShowSevaModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <h2 style={{ margin: '0 auto', fontSize: '18px', fontWeight: '600' }}>Seva Moment</h2>
            <div style={{ width: '40px' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '16px', color: '#E0E0E0', marginBottom: '8px' }}>
              You're about to make Maria happy.
            </p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              Would you like to make her whole community happy?
            </p>
          </div>

          {/* Seva Project Info */}
          <div style={{
            background: '#2A2A2A',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>The Navajo Weaving Center</p>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9CA3AF' }}>Goal: $25,000</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FDB910' }}>Raised: $18,450 (74%)</p>
            
            <div style={{
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '74%',
                height: '100%',
                background: 'linear-gradient(90deg, #FDB910 0%, #D4A017 100%)',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Giving Tiers */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#9CA3AF' }}>Choose your impact:</p>
            
            {sevaTiers.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => setDonationAmount(tier.amount)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '10px',
                  border: donationAmount === tier.amount ? '2px solid #FDB910' : '1px solid #333',
                  background: donationAmount === tier.amount ? 'rgba(253, 185, 16, 0.1)' : '#2A2A2A',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: donationAmount === tier.amount ? '2px solid #FDB910' : '2px solid #4B5563',
                  background: donationAmount === tier.amount ? '#FDB910' : 'transparent'
                }} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <span style={{ color: '#FDB910', fontWeight: '600' }}>${tier.amount}</span>
                  <span style={{ color: '#9CA3AF', marginLeft: '8px' }}>— {tier.impact}</span>
                </div>
              </button>
            ))}

            {/* Custom Amount */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#2A2A2A',
              borderRadius: '10px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: donationAmount === null ? '2px solid #FDB910' : '2px solid #4B5563',
                background: donationAmount === null ? '#FDB910' : 'transparent'
              }} />
              <span style={{ color: '#9CA3AF' }}>Custom: $</span>
              <input
                type="number"
                placeholder="0"
                onFocus={() => setDonationAmount(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  width: '80px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Notify Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <input type="checkbox" style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
              Notify me when this project is complete
            </span>
          </div>

          {/* Total & Complete */}
          <div style={{
            borderTop: '1px solid #333',
            paddingTop: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#9CA3AF' }}>Total with gift</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#FDB910' }}>
                ${450 + (donationAmount || 0)}
              </span>
            </div>
          </div>

          <button style={{
            width: '100%',
            padding: '18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            COMPLETE PURCHASE
          </button>
        </div>
      )}
    </div>
  );
}

function AudioPlayerButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const duration = 225; // 3:45 in seconds

  const transcription = [
    { text: "In my language, we don't say 'I weave.'", lang: "English" },
    { text: "We say 'I am weaving my grandmother's memories.'", lang: "English" },
    { text: "Each thread carries a prayer.", lang: "English" },
    { text: "Each pattern tells a story.", lang: "English" },
    { text: "This is how we keep our ancestors alive.", lang: "English" }
  ];

  const navajoTranslation = [
    { text: "Shí Diné bizaad bee haaghandi, 'éí t'áá áłchíní át'éego 'ádajółta.'", lang: "Navajo" },
    { text: "Nidi 'éí shíma sání baa hane' ádajółta' nidi.", lang: "Navajo" },
    { text: "T'áá áłchíní éí bee ádajółta'.", lang: "Navajo" },
    { text: "T'áá áłchíní éí bee ádajółta'.", lang: "Navajo" },
    { text: "Éí biniinaa shí Diné éí bee ádajółta'.", lang: "Navajo" }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!showPlayer) setShowPlayer(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTranscription = showTranslation ? navajoTranslation : transcription;

  return (
    <>
      <button 
        onClick={togglePlay}
        style={{
          flex: 1,
          padding: '14px',
          borderRadius: '10px',
          border: '1px solid #333',
          background: '#2A2A2A',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        </svg>
        {isPlaying ? 'Pause Story' : 'Listen to Story'}
      </button>

      {/* Audio Player Modal */}
      {showPlayer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.98)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          zIndex: 100
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => setShowPlayer(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ←
            </button>
            <h2 style={{ 
              margin: '0 auto', 
              fontSize: '16px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎧 MARIA'S STORY
            </h2>
            <div style={{ width: '40px' }} />
          </div>

          {/* Player Card */}
          <div style={{
            background: '#2A2A2A',
            borderRadius: '20px',
            padding: '32px 24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid #B51D19',
                background: isPlaying ? '#B51D19' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: isPlaying ? 'pulse 2s infinite' : 'none'
              }}
            >
              {isPlaying ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21"/>
                </svg>
              )}
            </button>

            {/* Progress Bar */}
            <div style={{
              height: '6px',
              background: '#333',
              borderRadius: '3px',
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentTime / duration) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #B51D19 0%, #FDB910 100%)',
                borderRadius: '3px',
                transition: 'width 0.3s'
              }} />
            </div>

            {/* Time */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transcription */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '0 8px 100px'
          }}>
            <p style={{
              fontSize: '22px',
              lineHeight: '1.8',
              color: '#E0E0E0',
              fontStyle: 'italic',
              margin: '0 0 24px 0'
            }}>
              {activeTranscription.map((line, i) => (
                <span key={i} style={{
                  display: 'block',
                  marginBottom: '20px',
                  opacity: currentTime > i * 45 ? 1 : 0.4,
                  transition: 'opacity 0.5s'
                }}>
                  "{line.text}"
                </span>
              ))}
            </p>
          </div>

          {/* Translation Button */}
          <div style={{
            position: 'fixed',
            bottom: '80px',
            left: '24px',
            right: '24px'
          }}>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
                color: '#1A1A1A',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {showTranslation ? 'View English' : 'View Translation (Navajo)'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(181, 29, 25, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(181, 29, 25, 0); }
        }
      `}</style>
    </>
  );
}
