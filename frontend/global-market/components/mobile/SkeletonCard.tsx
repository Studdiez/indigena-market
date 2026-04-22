'use client';

export function SkeletonCard() {
  return (
    <div style={{
      background: '#2A2A2A',
      borderRadius: '12px',
      overflow: 'hidden',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      {/* Image skeleton */}
      <div style={{
        aspectRatio: '1',
        background: '#333'
      }} />
      
      {/* Content skeleton */}
      <div style={{ padding: '12px' }}>
        <div style={{
          height: 16,
          background: '#333',
          borderRadius: 4,
          marginBottom: 8,
          width: '70%'
        }} />
        <div style={{
          height: 14,
          background: '#333',
          borderRadius: 4,
          width: '40%'
        }} />
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          background: '#2A2A2A',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          gap: '16px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: `${i * 0.1}s`
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            background: '#333',
            flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              height: 18,
              background: '#333',
              borderRadius: 4,
              marginBottom: 8,
              width: '60%'
            }} />
            <div style={{
              height: 14,
              background: '#333',
              borderRadius: 4,
              marginBottom: 8,
              width: '40%'
            }} />
            <div style={{
              height: 20,
              background: '#333',
              borderRadius: 4,
              width: '30%'
            }} />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
