'use client';

import Link from 'next/link';

const categories = [
  { icon: '🏫', label: 'Schools' },
  { icon: '🌍', label: 'Land' },
  { icon: '🏪', label: 'Hubs' },
  { icon: '💧', label: 'Water' },
];

const activeProjects = [
  { image: '🏫', name: 'School', raised: 12000, goal: 25000, percent: 48 },
  { image: '🌍', name: 'Land', raised: 8000, goal: 50000, percent: 16 },
  { image: '🏪', name: 'Hub', raised: 5000, goal: 15000, percent: 33 },
  { image: '💧', name: 'Water', raised: 2000, goal: 10000, percent: 20 },
];

export default function SevaHub() {
  const totalRaised = 2847392;
  const projectsCompleted = 147;
  const communitiesServed = 83;
  const myDonations = 340;
  const myProjects = 5;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px',
        textAlign: 'center',
        borderBottom: '1px solid #333'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 4px 0',
          color: '#B51D19',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>SEVA HUB</h1>
        <p style={{
          fontSize: '14px',
          color: '#FDB910',
          letterSpacing: '1px'
        }}>Building Together</p>
      </header>

      {/* Stats Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
        borderRadius: '16px',
        padding: '24px',
        margin: '24px',
        textAlign: 'center',
        border: '1px solid #333'
      }}>
        <p style={{
          fontSize: '36px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: '#FDB910'
        }}>
          ${totalRaised.toLocaleString()}
        </p>
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF',
          margin: '0 0 20px 0'
        }}>raised by our community</p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px'
        }}>
          <div>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>{projectsCompleted}</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>projects completed</p>
          </div>
          <div>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>{communitiesServed}</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>communities served</p>
          </div>
        </div>
      </div>

      {/* Featured Project */}
      <div style={{ padding: '0 24px 24px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: '#B51D19',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>Featured Project</h2>

        <div style={{
          background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              📸
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Maasai Women's Center
              </h3>
              <p style={{ margin: '0 0 4px 0', color: '#9CA3AF', fontSize: '14px' }}>
                Goal: $25,000
              </p>
              <p style={{ margin: 0, color: '#FDB910', fontSize: '14px', fontWeight: '600' }}>
                Raised: $18,450
              </p>
            </div>
          </div>

          <div style={{
            height: '10px',
            background: '#333',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '74%',
              height: '100%',
              background: 'linear-gradient(90deg, #FDB910 0%, #D4A017 100%)',
              borderRadius: '5px'
            }} />
          </div>

          <button style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
            color: '#1A1A1A',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            DONATE NOW
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 24px 24px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: '#9CA3AF'
        }}>Categories</h2>

        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              style={{
                minWidth: '80px',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#2A2A2A',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ fontSize: '12px', color: 'white' }}>{cat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Projects */}
      <div style={{ padding: '0 24px 24px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: '#B51D19',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>Active Projects</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {activeProjects.map((project) => (
            <div
              key={project.name}
              style={{
                background: '#2A2A2A',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                {project.image}
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {project.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px 0' }}>
                ${(project.raised / 1000).toFixed(0)}k/${(project.goal / 1000).toFixed(0)}k
              </p>
              <div style={{
                height: '6px',
                background: '#333',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${project.percent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FDB910 0%, #D4A017 100%)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Impact */}
      <div style={{ padding: '0 24px 24px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          color: '#FDB910',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>My Impact</h2>

        <div style={{
          background: '#2A2A2A',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>•</span>
              <span>You've donated <span style={{ color: '#FDB910', fontWeight: '600' }}>${myDonations}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>•</span>
              <span>Supported <span style={{ color: '#FDB910', fontWeight: '600' }}>{myProjects} projects</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>•</span>
              <span>Helped build <span style={{ color: '#FDB910', fontWeight: '600' }}>1 school</span></span>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <span style={{ color: '#1A1A1A', fontWeight: '600' }}>Badge: "School Builder"</span>
          </div>

          <Link href="/seva/impact" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              VIEW MY IMPACT DASHBOARD
            </button>
          </Link>
        </div>
      </div>

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
        <NavIcon icon="⚡" label="Seva" active />
        <NavIcon icon="🔍" label="Search" href="/market" />
        <NavIcon icon="👤" label="Profile" href="/creator" />
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
      color: active ? '#FDB910' : '#6B7280'
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
