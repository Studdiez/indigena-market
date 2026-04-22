'use client';

import Link from 'next/link';

interface FABProps {
  icon: string;
  label?: string;
  onClick?: () => void;
  href?: string;
  color?: 'primary' | 'secondary' | 'accent';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function FloatingActionButton({ 
  icon, 
  label, 
  onClick, 
  href, 
  color = 'primary',
  position = 'bottom-right'
}: FABProps) {
  const colors = {
    primary: 'linear-gradient(135deg, #B51D19 0%, #8B0000 100%)',
    secondary: 'linear-gradient(135deg, #2A5C2A 0%, #1E4A1E 100%)',
    accent: 'linear-gradient(135deg, #FDB910 0%, #D4A017 100%)'
  };

  const positions = {
    'bottom-right': { right: 24, bottom: 100 },
    'bottom-center': { left: '50%', transform: 'translateX(-50%)', bottom: 100 },
    'bottom-left': { left: 24, bottom: 100 }
  };

  const buttonContent = (
    <button
      onClick={onClick}
      style={{
        width: label ? 'auto' : 56,
        height: 56,
        borderRadius: 28,
        border: 'none',
        background: colors[color],
        color: color === 'accent' ? '#1A1A1A' : 'white',
        fontSize: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: label ? 8 : 0,
        padding: label ? '0 24px' : 0,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(181, 29, 25, 0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        WebkitTapHighlightColor: 'transparent'
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = label ? 'translateX(-50%) scale(0.95)' : 'scale(0.95)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = label ? 'translateX(-50%) scale(1)' : 'scale(1)';
      }}
    >
      <span>{icon}</span>
      {label && (
        <span style={{ 
          fontSize: 14, 
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>{label}</span>
      )}
    </button>
  );

  return (
    <div style={{
      position: 'fixed',
      zIndex: 100,
      ...positions[position]
    }}>
      {href ? (
        <Link href={href} style={{ textDecoration: 'none' }}>
          {buttonContent}
        </Link>
      ) : buttonContent}
    </div>
  );
}
