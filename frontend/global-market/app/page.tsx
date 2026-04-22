export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Indigena</h1>
      <p style={{ color: '#FDB910', marginBottom: '48px' }}>MARKET</p>
      
      <a href="/creator" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px', marginBottom: '16px' }}>
        <button style={{
          width: '100%',
          padding: '24px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          I'm here to create
        </button>
      </a>
      
      <a href="/market" style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}>
        <button style={{
          width: '100%',
          padding: '24px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          I'm here to explore
        </button>
      </a>
    </div>
  );
}
