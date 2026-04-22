'use client';

import Link from 'next/link';

const courses = [
  { title: 'Navajo Weaving Basics', price: 149, image: '🧶', instructor: 'Maria Begay', duration: '6 weeks' },
  { title: 'Traditional Pottery', price: 99, image: '🏺', instructor: 'Aiyana Yazzie', duration: '4 weeks' },
  { title: 'Beadwork Fundamentals', price: 79, image: '💎', instructor: 'Lena Crow', duration: '3 weeks' },
  { title: 'Indigenous Storytelling', price: 129, image: '📖', instructor: 'Eli Whittaker', duration: '5 weeks' },
  { title: 'Natural Dyeing', price: 89, image: '🎨', instructor: 'Tala Redbird', duration: '3 weeks' },
  { title: 'Language Preservation', price: 199, image: '🗣️', instructor: 'Sam Blackhorse', duration: '8 weeks' },
];

export default function Courses() {
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
          }}>Courses</h1>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: '#FDB910'
          }}>Learn</p>
        </div>
      </header>

      {/* Courses List */}
      <main style={{ padding: '24px', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {courses.map((course) => (
            <div key={course.title} style={{
              background: '#2A2A2A',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                flexShrink: 0
              }}>
                {course.image}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{course.title}</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9CA3AF' }}>by {course.instructor}</p>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6B7280' }}>⏱️ {course.duration}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#FDB910' }}>${course.price}</p>
                  <button style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Enroll
                  </button>
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
        <NavIcon icon="🔍" label="Browse" active />
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
