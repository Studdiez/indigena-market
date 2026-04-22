'use client';

import Link from 'next/link';

const stories = [
  {
    title: 'The Art of Navajo Weaving',
    excerpt: 'How one family has preserved this sacred tradition for four generations...',
    image: '🧶',
    author: 'Maria Begay',
    date: 'Feb 20, 2026',
    readTime: '5 min read'
  },
  {
    title: 'Reviving Traditional Pottery',
    excerpt: 'Young artists are bringing ancient techniques back to life...',
    image: '🏺',
    author: 'Aiyana Yazzie',
    date: 'Feb 18, 2026',
    readTime: '4 min read'
  },
  {
    title: 'Language Preservation Through Art',
    excerpt: 'How visual storytelling helps keep indigenous languages alive...',
    image: '🗣️',
    author: 'Sam Blackhorse',
    date: 'Feb 15, 2026',
    readTime: '6 min read'
  },
  {
    title: 'The Sacred Meaning of Colors',
    excerpt: 'Understanding the spiritual significance behind traditional palettes...',
    image: '🎨',
    author: 'Eli Whittaker',
    date: 'Feb 12, 2026',
    readTime: '5 min read'
  },
];

export default function Stories() {
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
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#B51D19'
          }}>Stories</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>From The Land</p>
        </div>
      </header>

      {/* Featured Story */}
      <section style={{ padding: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px'
          }}>
            🧶
          </div>
          <div style={{ padding: '20px' }}>
            <span style={{
              background: '#FDB910',
              color: '#1A1A1A',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>Featured</span>
            <h2 style={{ fontSize: '22px', fontWeight: '600', margin: '12px 0 8px 0' }}>
              The Art of Navajo Weaving
            </h2>
            <p style={{ color: '#9CA3AF', margin: '0 0 16px 0', lineHeight: '1.6' }}>
              How one family has preserved this sacred tradition for four generations, passing down knowledge from grandmother to granddaughter...
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#B51D19',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>M</div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Maria Begay</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>Feb 20, 2026 · 5 min read</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories List */}
      <main style={{ padding: '0 24px 100px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>More Stories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {stories.slice(1).map((story) => (
            <div key={story.title} style={{
              background: '#2A2A2A',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '16px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                flexShrink: 0
              }}>
                {story.image}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{story.title}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>
                  {story.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{story.author}</span>
                  <span style={{ color: '#6B7280' }}>·</span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{story.readTime}</span>
                </div>
              </div>
            </div>
          ))}
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
        <NavIcon icon="🏠" label="Home" href="/market" />
        <NavIcon icon="📖" label="Stories" active />
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
        <NavIcon icon="👤" label="Profile" />
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
