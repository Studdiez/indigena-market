'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [selectedGift, setSelectedGift] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState('');
  const [notifyComplete, setNotifyComplete] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = 490;
  const giftAmount = selectedGift === -1 ? (parseInt(customAmount) || 0) : (selectedGift || 0);
  const total = subtotal + giftAmount;

  const giftTiers = [
    { amount: 5, impact: 'Buys yarn for 3 weavers' },
    { amount: 15, impact: 'Buys a loom' },
    { amount: 25, impact: 'Buys a classroom' },
    { amount: 50, impact: 'Sponsors a student' },
  ];

  const handleComplete = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return <SuccessScreen giftAmount={giftAmount} />;
  }

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
        <Link href="/market/nft/navajo-weaving" style={{ color: 'white', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Checkout</h1>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', paddingBottom: '120px' }}>
        {/* Order Summary */}
        <div style={{
          background: '#2A2A2A',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>• Weaving Rug</span>
              <span>$450</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>• Shipping</span>
              <span>$25</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>• Tax</span>
              <span>$15</span>
            </div>
            <div style={{ borderTop: '1px solid #333', marginTop: '8px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${subtotal}</span>
            </div>
          </div>
        </div>

        {/* Seva Moment Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}>❤️</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>SEVA MOMENT</span>
          <span style={{ fontSize: '20px', marginLeft: '8px' }}>❤️</span>
        </div>

        {/* Seva Card */}
        <div style={{
          background: '#2A2A2A',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          {/* Project Image */}
          <div style={{
            width: '100%',
            height: '180px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            marginBottom: '20px'
          }}>
            🧶
          </div>

          <p style={{
            fontSize: '18px',
            textAlign: 'center',
            margin: '0 0 8px 0',
            color: '#E0E0E0'
          }}>You're about to make Maria happy.</p>
          <p style={{
            fontSize: '16px',
            textAlign: 'center',
            margin: '0 0 20px 0',
            color: '#9CA3AF'
          }}>Would you like to make her whole community happy?</p>

          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>The Navajo Weaving Center</h3>
          <p style={{ margin: '0 0 4px 0', color: '#9CA3AF' }}>Goal: $25,000</p>
          <p style={{ margin: '0 0 16px 0', color: '#FDB910', fontWeight: '600' }}>Raised: $18,450</p>

          {/* Progress Bar */}
          <div style={{
            height: '10px',
            background: '#333',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '74%',
              height: '100%',
              background: 'linear-gradient(90deg, #FDB910 0%, #D4A017 100%)',
              borderRadius: '5px'
            }} />
          </div>

          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#9CA3AF' }}>
            Add a gift to help them reach their goal:
          </p>

          {/* Gift Tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {giftTiers.map((tier) => (
              <label
                key={tier.amount}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '10px',
                  border: selectedGift === tier.amount ? '2px solid #FDB910' : '1px solid #333',
                  background: selectedGift === tier.amount ? 'rgba(253, 185, 16, 0.1)' : '#1A1A1A',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="gift"
                  checked={selectedGift === tier.amount}
                  onChange={() => { setSelectedGift(tier.amount); setCustomAmount(''); }}
                  style={{ width: '20px', height: '20px', accentColor: '#FDB910' }}
                />
                <span style={{ fontWeight: '600', color: '#FDB910', minWidth: '40px' }}>
                  ${tier.amount}
                </span>
                <span style={{ color: '#9CA3AF' }}>{tier.impact}</span>
              </label>
            ))}

            {/* Custom Amount */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                border: selectedGift === -1 ? '2px solid #FDB910' : '1px solid #333',
                background: selectedGift === -1 ? 'rgba(253, 185, 16, 0.1)' : '#1A1A1A',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="gift"
                checked={selectedGift === -1}
                onChange={() => setSelectedGift(-1)}
                style={{ width: '20px', height: '20px', accentColor: '#FDB910' }}
              />
              <span style={{ color: '#9CA3AF' }}>Custom: $</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedGift(-1); }}
                placeholder="0"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #333',
                  color: 'white',
                  fontSize: '16px',
                  width: '80px',
                  outline: 'none'
                }}
              />
            </label>
          </div>

          {/* Notify Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={notifyComplete}
              onChange={(e) => setNotifyComplete(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#FDB910' }}
            />
            <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
              "Notify me when this project is complete"
            </span>
          </label>
        </div>
      </main>

      {/* Sticky Footer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1A1A1A',
        borderTop: '1px solid #333',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ color: '#9CA3AF' }}>Total with gift</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#FDB910' }}>
            ${total}
          </span>
        </div>
        <button
          onClick={handleComplete}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          COMPLETE PURCHASE
          <span style={{ display: 'block', fontSize: '12px', fontWeight: '400', marginTop: '4px', opacity: 0.8 }}>
            Change lives.
          </span>
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ giftAmount }: { giftAmount: number }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Celebration Animation */}
      <div style={{
        fontSize: '60px',
        marginBottom: '24px',
        animation: 'bounce 1s infinite'
      }}>
        🎉
      </div>

      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: '#FDB910'
      }}>THANK YOU</h1>

      <p style={{
        fontSize: '18px',
        margin: '0 0 32px 0',
        color: '#E0E0E0'
      }}>Your rug is on its way!</p>

      <div style={{
        background: '#2A2A2A',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        maxWidth: '360px'
      }}>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '0 0 16px 0',
          color: '#E0E0E0'
        }}>
          And your <span style={{ color: '#FDB910', fontWeight: '600' }}>${giftAmount} gift</span> is now building a school.
        </p>
        
        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '16px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#9CA3AF',
            margin: 0
          }}>
            When the project completes, we'll send you photos and a video from the community.
          </p>
        </div>
      </div>

      {/* Social Share */}
      <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 16px 0' }}>Share your impact:</p>
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <button style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid #333',
          background: '#2A2A2A',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}>f</button>
        <button style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid #333',
          background: '#2A2A2A',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}>🐦</button>
        <button style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid #333',
          background: '#2A2A2A',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}>📷</button>
        <button style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid #333',
          background: '#2A2A2A',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}>🔗</button>
      </div>

      <Link href="/market" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}>
        <button style={{
          width: '100%',
          padding: '18px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
          color: '#1A1A1A',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          CONTINUE SHOPPING
        </button>
      </Link>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
