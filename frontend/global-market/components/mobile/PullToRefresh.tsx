'use client';

import { useState, useCallback, useRef } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && diff < 150) {
      setPullDistance(diff * 0.5);
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance > 60) {
      setIsRefreshing(true);
      setPullDistance(60);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, onRefresh]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Pull indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: pullDistance,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: isPulling ? 'none' : 'height 0.3s ease'
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${pullDistance * 2}deg)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease'
        }}>
          {isRefreshing ? (
            <div style={{
              width: 20,
              height: 20,
              border: '2px solid #B51D19',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <span style={{ fontSize: 20 }}>↓</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
