'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import Marketplace from '@/app/components/Marketplace';
import HomePage from '@/app/components/HomePage';

const ALLOWED_PILLARS = new Set([
  'digital-arts',
  'physical-items',
  'courses',
  'freelancing',
  'seva',
  'cultural-tourism',
  'language-heritage',
  'land-food',
  'advocacy-legal',
  'materials-tools'
]);

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePillarFromUrl = searchParams.get('pillar');
  const activePillar = activePillarFromUrl && ALLOWED_PILLARS.has(activePillarFromUrl)
    ? activePillarFromUrl
    : 'digital-arts';
  const currentView: 'home' | 'marketplace' = activePillarFromUrl ? 'marketplace' : 'home';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePillarSelect = (pillarId: string) => {
    if (pillarId === 'courses') return router.push('/courses', { scroll: false });
    if (pillarId === 'seva') return router.push('/seva', { scroll: false });
    if (pillarId === 'cultural-tourism') return router.push('/cultural-tourism', { scroll: false });
    if (pillarId === 'language-heritage') return router.push('/language-heritage', { scroll: false });
    if (pillarId === 'land-food') return router.push('/land-food', { scroll: false });
    if (pillarId === 'advocacy-legal') return router.push('/advocacy-legal', { scroll: false });
    if (pillarId === 'materials-tools') return router.push('/materials-tools', { scroll: false });
    router.push(`/?pillar=${pillarId}`, { scroll: false });
  };

  const handleHomeClick = () => {
    router.push('/', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar
        activePillar={currentView === 'marketplace' ? activePillar : ''}
        onPillarChange={() => {}}
        isCollapsed={isCollapsed}
        onCollapseChange={setIsCollapsed}
      />

      <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        <Header onMenuClick={handleHomeClick} />

        <main className="pt-16 min-h-screen w-full overflow-x-hidden">
          {currentView === 'home' ? (
            <HomePage onPillarSelect={handlePillarSelect} />
          ) : (
            <Marketplace activePillar={activePillar} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <HomeContent />
    </Suspense>
  );
}
