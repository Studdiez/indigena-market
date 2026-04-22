'use client';
import { Package, Tag, ChevronRight, Check, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { PlacementPill, placementFeaturedCardClass } from '@/app/components/placements/PremiumPlacement';

interface BundleItem {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  creator: string;
  items: BundleItem[];
  totalOriginalPrice: number;
  bundlePrice: number;
  savings: number;
  currency: string;
  timeLeft: string;
}

const bundles: Bundle[] = [
  {
    id: 'bundle-1',
    name: 'Heritage Collection Pack',
    description: 'Thoughtfully grouped offerings celebrating Indigenous culture through a collector-ready arc.',
    creator: 'Maria Redfeather',
    items: [
      { id: '1', name: 'Eagle Spirit', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=200&fit=crop', originalPrice: 0.3 },
      { id: '2', name: 'Wolf Wisdom', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop', originalPrice: 0.25 },
      { id: '3', name: 'Bear Strength', image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=200&h=200&fit=crop', originalPrice: 0.35 },
      { id: '4', name: 'Turtle Island', image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=200&h=200&fit=crop', originalPrice: 0.28 },
      { id: '5', name: 'Four Directions', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&h=200&fit=crop', originalPrice: 0.32 }
    ],
    totalOriginalPrice: 1.5,
    bundlePrice: 0.99,
    savings: 0.51,
    currency: 'INDI',
    timeLeft: '2 days left'
  },
  {
    id: 'bundle-2',
    name: 'Digital Art Starter Kit',
    description: 'A gentle entry point for new collectors who want a strong first set of Indigenous digital works.',
    creator: 'ThunderVoice',
    items: [
      { id: '6', name: 'Sunrise Ceremony', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop', originalPrice: 0.15 },
      { id: '7', name: 'Moon Dance', image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=200&h=200&fit=crop', originalPrice: 0.12 },
      { id: '8', name: 'Star Stories', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', originalPrice: 0.18 }
    ],
    totalOriginalPrice: 0.45,
    bundlePrice: 0.29,
    savings: 0.16,
    currency: 'INDI',
    timeLeft: '5 days left'
  }
];

export default function BundleDeals() {
  const leadBundle = bundles[0];
  const secondaryBundles = bundles.slice(1);

  return (
    <section className="bg-gradient-to-b from-[#0a0a0a] to-[#141414] px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#DC143C] to-red-600 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Creator Collections</h2>
              <p className="text-gray-400 text-sm">Thoughtfully grouped offerings from Indigenous creators.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#DC143C]/10 rounded-full">
            <Tag size={16} className="text-[#DC143C]" />
            <span className="text-[#DC143C] text-sm font-medium">Curated commerce</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div
            className={`${placementFeaturedCardClass} overflow-hidden`}
          >
            <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <img
                  src={leadBundle.items[0].image}
                  alt={leadBundle.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PlacementPill tone="rose">Featured collection</PlacementPill>
                    <PlacementPill>Featured by Indigena</PlacementPill>
                  </div>
                  <span className="rounded-full border border-[#d4af37]/35 bg-[#0b0b0b]/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3d57c] backdrop-blur-sm">
                    Save {(leadBundle.savings / leadBundle.totalOriginalPrice * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]/75">Curated creator collection</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{leadBundle.name}</h3>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#d4af37]/75">Featured by Indigena</p>
                    <p className="mt-3 text-sm leading-7 text-gray-200">{leadBundle.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6">
                <div>
                  <p className="text-sm text-gray-400">by {leadBundle.creator}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {leadBundle.items.slice(0, 6).map((item, idx) => (
                      <div
                        key={item.id}
                        className={`relative aspect-square overflow-hidden rounded-lg ${idx === 5 && leadBundle.items.length > 6 ? 'opacity-50' : ''}`}
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        {idx === 5 && leadBundle.items.length > 6 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="text-lg font-bold text-white">+{leadBundle.items.length - 6}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#d4af37]/10 bg-[#111111] p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-gray-400">Includes</span>
                      <span className="font-medium text-white">{leadBundle.items.length} works</span>
                    </div>
                    <div className="space-y-2">
                      {leadBundle.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <Check size={14} className="text-[#d4af37]" />
                          <span className="text-gray-300">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                      <ClockIcon />
                      <span>{leadBundle.timeLeft}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">{leadBundle.totalOriginalPrice} {leadBundle.currency}</span>
                      <span className="text-sm font-medium text-[#DC143C]">-{leadBundle.savings} {leadBundle.currency}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{leadBundle.bundlePrice}</span>
                      <span className="font-medium text-[#d4af37]">{leadBundle.currency}</span>
                    </div>
                  </div>

                  <Link href={`/bundles?bundle=${leadBundle.id}`} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e0ba43] to-[#b8941f] px-7 py-3 font-semibold text-black transition-colors hover:bg-[#f4e4a6]">
                    <ShoppingCart size={18} />
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {secondaryBundles.map((bundle) => (
              <div
                key={bundle.id}
                className="rounded-2xl border border-[#d4af37]/10 bg-[#141414] p-5 transition-all hover:border-[#d4af37]/30"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400">by {bundle.creator}</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{bundle.name}</h3>
                  </div>
                  <span className="rounded-full bg-[#DC143C]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#DC143C]">
                    Save {(bundle.savings / bundle.totalOriginalPrice * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="mb-4 text-sm leading-7 text-gray-400">{bundle.description}</p>

                <div className="mb-4 flex items-center gap-3 overflow-hidden rounded-xl bg-[#0d0d0d] p-3">
                  {bundle.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="h-16 w-16 overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="text-sm text-gray-400">
                    <p>{bundle.items.length} pieces</p>
                    <p>{bundle.timeLeft}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-400 line-through">{bundle.totalOriginalPrice} {bundle.currency}</p>
                    <p className="text-2xl font-bold text-white">{bundle.bundlePrice} <span className="text-base font-medium text-[#d4af37]">{bundle.currency}</span></p>
                  </div>
                  <Link href={`/bundles?bundle=${bundle.id}`} className="rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2.5 font-medium text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-black">
                    View collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/bundles"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#d4af37]/30 rounded-full text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
          >
            Browse All Creator Collections
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}
