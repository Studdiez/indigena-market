'use client';

import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Users,
  MapPinned,
  CalendarRange,
  Mountain
} from 'lucide-react';
import CulturalTourismMarketplace from '@/app/components/marketplace/CulturalTourismMarketplace';
import CulturalTourismFrame from './components/CulturalTourismFrame';

const whyThisMatters = [
  {
    title: 'Support community-led tourism',
    description: 'Travel experiences are led by Indigenous operators, guides, and communities shaping the terms of engagement.'
  },
  {
    title: 'Preserve culture through lived experience',
    description: 'Journeys connect guests with language, land, foodways, story, and seasonal knowledge in context.'
  },
  {
    title: 'Travel with respect and protocol',
    description: 'Listings surface trust, protocol, and hosting signals so visitors understand how to arrive well.'
  }
];

const travelSignals = [
  { label: 'Explore by Territory', text: 'Browse by Nation, place, and region instead of treating experiences like generic inventory.', icon: MapPinned },
  { label: 'Protocol Verified', text: 'Trust signals make it easier to understand host expectations, cultural boundaries, and guest responsibilities.', icon: ShieldCheck },
  { label: 'Seasonal Availability', text: 'See what is open now, what is filling up, and what should be planned around ceremony and climate.', icon: CalendarRange }
];

export default function CulturalTourismPage() {
  return (
    <CulturalTourismFrame
      title="Cultural Tourism Marketplace"
      subtitle="Indigenous-led experiences, protocol-aware travel, and premium placement exposure across destination discovery."
      showPremiumHero={false}
      showStickyBanner={false}
      showPageHeader={false}
    >
      <section className="overflow-hidden rounded-[30px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(33,25,14,0.96),rgba(10,10,10,0.98))] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Indigenous-led journeys</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white lg:text-5xl">
              Walk with Indigenous knowledge keepers.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
              Experience land, story, and culture through Indigenous-led journeys shaped by community protocol, local hosting, and place-based knowledge.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#tourism-discovery"
                className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
              >
                Explore Experiences
              </Link>
              <Link
                href="/cultural-tourism/operator"
                className="rounded-full border border-[#d4af37]/25 bg-black/20 px-5 py-3 text-sm font-semibold text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
              >
                Become an Operator
              </Link>
            </div>

            <div className="mt-7 rounded-3xl border border-[#d4af37]/18 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Why this matters</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {whyThisMatters.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[26px] border border-[#d4af37]/20 bg-[#141414]">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=700&fit=crop"
                  alt="Indigenous-led coastal walking journey"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#d4af37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                    Community Spotlight
                  </span>
                  <span className="rounded-full border border-[#d4af37]/25 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4d47a]">
                    Seasonal Highlight
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white">Dawn walk through coastal country</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  A guided journey shaped by seasonal knowledge, visitor protocol, and story shared on Country with community hosts.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                    Next available: May 12
                  </span>
                  <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#f4d47a]">
                    5 seats left
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-300">
                    Elder approved
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {travelSignals.map((signal) => (
                <article key={signal.label} className="rounded-2xl border border-white/10 bg-[#141414]/90 p-4">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <signal.icon size={16} />
                    <p className="text-[11px] uppercase tracking-[0.24em]">{signal.label}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{signal.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CulturalTourismMarketplace />

      <section className="rounded-[28px] border border-[#d4af37]/18 bg-[linear-gradient(135deg,rgba(26,20,10,0.96),rgba(10,10,10,0.98))] p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4af37]">Plan respectfully</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Plan a journey that respects land, culture, and community.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Back experiences that are community-led, transparent about protocol, and designed to leave value with local hosts and future generations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cultural-tourism/experiences"
              className="rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
            >
              Explore Experiences
            </Link>
            <Link
              href="/cultural-tourism/operator"
              className="rounded-full border border-[#d4af37]/25 bg-black/20 px-5 py-3 text-sm font-semibold text-[#f4d47a] transition-colors hover:border-[#d4af37]/45 hover:bg-[#d4af37]/10"
            >
              Become an Operator
            </Link>
          </div>
        </div>
      </section>
    </CulturalTourismFrame>
  );
}
