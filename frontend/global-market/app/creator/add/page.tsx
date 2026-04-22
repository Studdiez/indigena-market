'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddNewArt() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [royalties, setRoyalties] = useState(true);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime(t => t + 1);
    }, 1000);
    setTimeout(() => clearInterval(interval), 60000); // Max 60 seconds
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    setShowStoryModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        <Link href="/creator" style={{ color: 'white', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Add New Art</h1>
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
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Primary Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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
            gap: '12px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            TAKE PHOTO
          </button>

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
            gap: '12px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            RECORD VIDEO
          </button>

          <button 
            onClick={() => setShowStoryModal(true)}
            style={{
              width: '100%',
              padding: '20px',
              borderRadius: '12px',
              border: 'none',
              background: hasRecording 
                ? 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)'
                : 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            {hasRecording ? '✓ STORY RECORDED' : 'RECORD STORY'}
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is this piece called?"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #333',
              background: '#2A2A2A',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
            Price $
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #333',
              background: '#2A2A2A',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        {/* Royalties Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          background: '#2A2A2A',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <span>Ongoing royalties?</span>
          </div>
          <button
            onClick={() => setRoyalties(!royalties)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              border: 'none',
              background: royalties ? '#2A5C2A' : '#4B5563',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '2px',
              left: royalties ? '22px' : '2px',
              transition: 'left 0.3s'
            }} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            SAVE DRAFT
          </button>
          <button style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            PUBLISH NOW
          </button>
        </div>
      </main>

      {/* Story Recording Modal */}
      {showStoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Tell your story</h2>
          <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: '32px' }}>
            Share the meaning behind your creation
          </p>

          {/* Recording Circle */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid ' + (isRecording ? '#B51D19' : '#333'),
              background: isRecording ? '#B51D19' : 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              {isRecording ? (
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              ) : (
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              )}
            </svg>
            <span style={{ color: 'white', fontSize: '12px', marginTop: '4px' }}>
              {isRecording ? formatTime(recordingTime) : 'RECORD'}
            </span>
          </button>

          {/* Prompts */}
          <div style={{
            background: '#2A2A2A',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            maxWidth: '360px'
          }}>
            <p style={{ color: '#9CA3AF', margin: '0 0 12px 0', fontSize: '14px' }}>
              Tell us about this piece:
            </p>
            <ul style={{ color: 'white', margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
              <li>Where is it from?</li>
              <li>What does it mean?</li>
              <li>Who is it for?</li>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {hasRecording && (
              <button style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer'
              }}>
                ▶ Listen back
              </button>
            )}
            <button
              onClick={() => setShowStoryModal(false)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {hasRecording ? 'Save & Continue' : 'Close'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
