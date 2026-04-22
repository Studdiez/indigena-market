'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import HomeMarketplaceModal, { type HomeMarketplaceItem } from './HomeMarketplaceModal';
import { PlacementPill, placementFeaturedCardClass, placementFeaturedInsetClass } from '@/app/components/placements/PremiumPlacement';

interface NewDrop {
  id: string;
  name: string;
  creator: string;
  image: string;
  price: number;
  currency: string;
  dropTime: Date;
  totalItems: number;
  soldItems: number;
  isLive: boolean;
}

const newDrops: NewDrop[] = [
  {
    id: 'drop-1',
    name: 'Sacred Geometry Collection',
    creator: 'Maria Redfeather',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop',
    price: 0.5,
    currency: 'INDI',
    dropTime: new Date('2026-04-11T16:00:00.000Z'),
    totalItems: 100,
    soldItems: 0,
    isLive: false
  },
  {
    id: 'drop-2',
    name: 'Spirit Animals Series',
    creator: 'ThunderVoice',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    price: 0.3,
    currency: 'INDI',
    dropTime: new Date('2026-04-11T13:00:00.000Z'),
    totalItems: 50,
    soldItems: 34,
    isLive: true
  },
  {
    id: 'drop-3',
    name: 'Traditional Patterns',
    creator: 'Elena Rivers',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop',
    price: 0.25,
    currency: 'INDI',
    dropTime: new Date('2026-04-12T14:00:00.000Z'),
    totalItems: 75,
    soldItems: 0,
    isLive: false
  },
  {
    id: 'drop-4',
    name: 'Digital Weaving Art',
    creator: 'DesertRose',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
    price: 0.4,
    currency: 'INDI',
    dropTime: new Date('2026-04-11T11:30:00.000Z'),
    totalItems: 30,
    soldItems: 28,
    isLive: true
  }
];

function CountdownTimer({ targetTime }: { targetTime: Date }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState('--');

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const diff = targetTime.getTime() - Date.now();
      if (diff <= 0) return 'LIVE NOW';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <span className={timeLeft === 'LIVE NOW' ? 'text-green-400 animate-pulse' : 'text-[#d4af37]'}>
      {mounted ? timeLeft : '--'}
    </span>
  );
}

export default function NewArrivals() {
  const [activeItem, setActiveItem] = useState<HomeMarketplaceItem | null>(null);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const spotlightDrop = newDrops.find((drop) => drop.id === 'drop-2') ?? newDrops[0];
  const supportingDrops = newDrops.filter((drop) => drop.id !== spotlightDrop.id);

  return (
    <section className="bg-[#0a0a0a] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-lg flex items-center justify-center">
              <Sparkles size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">New Arrivals & Drops</h2>
              <p className="text-gray-400 text-sm">Fresh releases from Indigenous creators, with one premium spotlight drop anchored into discovery.</p>
            </div>
          </div>
          <Link 
            href="/drops"
            className="flex items-center gap-1 text-[#d4af37] hover:text-[#f4e4a6] transition-colors"
          >
            View All Drops
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          <div className={`${placementFeaturedCardClass} p-5 md:p-6`}>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={spotlightDrop.image}
                  alt={spotlightDrop.name}
                  className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2">
                  <PlacementPill>Featured by Indigena</PlacementPill>
                  <PlacementPill>Spotlight premium</PlacementPill>
                </div>
                <div className="absolute left-4 top-16 flex flex-wrap items-center gap-2">
                  {spotlightDrop.isLive ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-[#DC143C] px-3 py-1.5">
                      <Zap size={14} className="text-white" />
                      <span className="text-xs font-bold text-white">LIVE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                      <Clock size={14} className="text-[#d4af37]" />
                      <CountdownTimer targetTime={spotlightDrop.dropTime} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className={`${placementFeaturedInsetClass} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37]/75">High-visibility featured drop</p>
                    <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{spotlightDrop.name}</h3>
                    <p className="mt-2 text-sm text-gray-200">by {spotlightDrop.creator}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]/75">Curated launch window</p>
                  <h3 className="mt-3 text-3xl font-bold text-white">This week&apos;s spotlight drop</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">
                    One premium homepage slot is reserved for a launch that deserves extra attention. It gets stronger framing, richer context, and the most cinematic real estate in the discovery flow.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[#d4af37]/14 bg-black/25 p-4">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Edition price</p>
                      <p className="secondary-gradient text-3xl font-bold">{spotlightDrop.price} {spotlightDrop.currency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Momentum</p>
                      <p className="text-sm font-medium text-white">{spotlightDrop.soldItems} of {spotlightDrop.totalItems} claimed</p>
                    </div>
                  </div>

                  {spotlightDrop.isLive && (
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Sell-through</span>
                        <span className="text-[#d4af37]">{Math.round((spotlightDrop.soldItems / spotlightDrop.totalItems) * 100)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#0a0a0a]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#DC143C]"
                          style={{ width: `${(spotlightDrop.soldItems / spotlightDrop.totalItems) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveItem({
                        id: spotlightDrop.id,
                        title: spotlightDrop.name,
                        creator: spotlightDrop.creator,
                        image: spotlightDrop.image,
                        price: spotlightDrop.price,
                        currency: spotlightDrop.currency,
                        description: `${spotlightDrop.name} is currently live with ${spotlightDrop.soldItems} of ${spotlightDrop.totalItems} editions already claimed.`,
                        detailHref: `/drops`,
                        artistHref: `/artist/${spotlightDrop.creator.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                      })
                    }
                    className="block w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8941f] py-3 text-center font-semibold text-black transition-all hover:shadow-lg hover:shadow-[#d4af37]/25"
                  >
                    View Spotlight Drop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {supportingDrops.map((drop) => (
              <div
                key={drop.id}
                className="group grid grid-cols-[108px_1fr] gap-4 rounded-2xl border border-[#d4af37]/10 bg-[#141414] p-3 transition-all hover:border-[#d4af37]/30"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={drop.image}
                    alt={drop.name}
                    className="h-full min-h-[110px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2">
                    {drop.isLive ? (
                      <div className="flex items-center gap-1 rounded-full bg-[#DC143C] px-2 py-1">
                        <Zap size={12} className="text-white" />
                        <span className="text-[10px] font-bold text-white">LIVE</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
                        <Clock size={12} className="text-[#d4af37]" />
                        <CountdownTimer targetTime={drop.dropTime} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{drop.name}</h3>
                    <p className="mt-1 text-sm text-gray-400">by {drop.creator}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gray-500">
                      {drop.isLive ? `${drop.soldItems} of ${drop.totalItems} sold` : 'Upcoming release'}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[#d4af37]">{drop.price} {drop.currency}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (drop.isLive) {
                          setActiveItem({
                            id: drop.id,
                            title: drop.name,
                            creator: drop.creator,
                            image: drop.image,
                            price: drop.price,
                            currency: drop.currency,
                            description: `${drop.name} is currently live with ${drop.soldItems} of ${drop.totalItems} editions already claimed.`,
                            detailHref: `/drops`,
                            artistHref: `/artist/${drop.creator.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                          });
                          return;
                        }
                        setReminders((current) => ({ ...current, [drop.id]: !current[drop.id] }));
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        drop.isLive
                          ? 'bg-[#d4af37]/12 text-[#d4af37] hover:bg-[#d4af37]/20'
                          : 'border border-[#d4af37]/25 bg-[#0a0a0a] text-white hover:border-[#d4af37]'
                      }`}
                    >
                      {drop.isLive ? 'View drop' : reminders[drop.id] ? 'Reminder set' : 'Remind me'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomeMarketplaceModal item={activeItem} mode="buy" isOpen={Boolean(activeItem)} onClose={() => setActiveItem(null)} />
    </section>
  );
}
