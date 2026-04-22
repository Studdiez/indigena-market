'use client';

import { useState, useEffect, useCallback } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'small' | 'medium' | 'large' | 'full';
}

export function BottomSheet({ isOpen, onClose, title, children, height = 'medium' }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);

  const heights = {
    small: '30%',
    medium: '50%',
    large: '75%',
    full: '90%'
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setDragY(diff);
    }
  }, [isDragging, startY]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  }, [dragY, onClose]);

  if (!isVisible && !isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      pointerEvents: isOpen ? 'auto' : 'none'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          backdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Sheet */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: heights[height],
          backgroundColor: '#1A1A1A',
          borderRadius: '24px 24px 0 0',
          transform: `translateY(${isOpen ? dragY : '100%'})`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Handle */}
        <div style={{
          padding: '12px 0',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'grab'
        }}>
          <div style={{
            width: 40,
            height: 4,
            backgroundColor: '#4A4A4A',
            borderRadius: 2
          }} />
        </div>
        
        {/* Header */}
        {title && (
          <div style={{
            padding: '0 24px 16px',
            borderBottom: '1px solid #2A2A2A'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: 'white'
            }}>{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 24px 32px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
