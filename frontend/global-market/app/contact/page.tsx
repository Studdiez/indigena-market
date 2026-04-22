'use client';

import Link from 'next/link';

export default function Contact() {
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
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Contact Us</h1>
      </header>

      {/* Contact Info */}
      <section style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>💬</p>
          <h2 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 8px 0' }}>Get in Touch</h2>
          <p style={{ color: '#9CA3AF', margin: 0 }}>We\'d love to hear from you</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <ContactCard 
            icon="✉️" 
            title="Email Us" 
            info="hello@indigenamarket.com"
            description="For general inquiries"
          />
          <ContactCard 
            icon="🎨" 
            title="Artist Support" 
            info="artists@indigenamarket.com"
            description="For creators and sellers"
          />
          <ContactCard 
            icon="⚡" 
            title="Seva Projects" 
            info="seva@indigenamarket.com"
            description="For community projects"
          />
        </div>

        {/* Contact Form */}
        <div style={{
          background: '#2A2A2A',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>Send a Message</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#9CA3AF' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                  background: '#1A1A1A',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#9CA3AF' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                  background: '#1A1A1A',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#9CA3AF' }}>
                Message
              </label>
              <textarea
                placeholder="How can we help you?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                  background: '#1A1A1A',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Social Links */}
      <section style={{ padding: '0 24px 100px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', textAlign: 'center' }}>
          Follow Us
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <SocialButton icon="📘" label="Facebook" />
          <SocialButton icon="📸" label="Instagram" />
          <SocialButton icon="🐦" label="Twitter" />
          <SocialButton icon="▶️" label="YouTube" />
        </div>
      </section>

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
        <NavIcon icon="👤" label="Profile" />
      </nav>
    </div>
  );
}

function ContactCard({ icon, title, info, description }: { icon: string; title: string; info: string; description: string }) {
  return (
    <div style={{
      background: '#2A2A2A',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '32px' }}>{icon}</div>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', color: '#9CA3AF' }}>{title}</h4>
        <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>{info}</p>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button style={{
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      border: '1px solid #333',
      background: '#2A2A2A',
      fontSize: '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} title={label}>
      {icon}
    </button>
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
