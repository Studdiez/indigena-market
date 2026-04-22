'use client';

import Link from 'next/link';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { PlacementPill, placementFeaturedCardClass, placementPrimaryButtonClass, placementSecondaryButtonClass } from '@/app/components/placements/PremiumPlacement';

const closingFeature = {
  title: 'Support the next generation of Indigenous artists',
  description:
    'A final premium feature reserved for story-led collections, creator launches, and community-backed moments that deserve one more emotional invitation before visitors reach pricing.',
  image:
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=720&fit=crop',
  sponsor: 'Riverstone Arts Council',
  collectionLabel: 'Next generation makers',
  impact: 'Seen by every visitor moving into the membership and premium booking section.',
  primaryHref: '/communities/riverstone-arts-council/store',
  secondaryHref: '/launchpad'
};

export default function FinalSpotlight() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className={`${placementFeaturedCardClass} overflow-hidden`}>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[340px]">
              <img src={closingFeature.image} alt={closingFeature.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
            </div>

            <div className="relative p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <PlacementPill icon={HeartHandshake}>Final spotlight</PlacementPill>
                <PlacementPill>Featured by Indigena</PlacementPill>
              </div>

              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#d4af37]/75">
                Closing feature placement
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold text-white md:text-4xl">
                {closingFeature.title}
              </h2>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#d4af37]">
                {closingFeature.collectionLabel}
              </p>
              <p className="mt-4 max-w-xl text-base leading-8 text-gray-300">
                {closingFeature.description}
              </p>

              <div className="mt-6 rounded-2xl border border-[#d4af37]/14 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]/75">Why this lane matters</p>
                <p className="mt-2 text-sm leading-7 text-gray-300">{closingFeature.impact}</p>
                <p className="mt-3 text-sm text-[#f4e4a6]">Featured partner: {closingFeature.sponsor}</p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={closingFeature.primaryHref} className={placementPrimaryButtonClass}>
                  Explore Collection
                  <ArrowRight size={16} />
                </Link>
                <Link href={closingFeature.secondaryHref} className={placementSecondaryButtonClass}>
                  Support Creator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
