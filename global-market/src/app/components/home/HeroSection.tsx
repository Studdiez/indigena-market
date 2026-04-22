'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Volume2, ArrowRight, ArrowUpRight } from 'lucide-react';
import HomeMarketplaceModal, { type HomeMarketplaceItem } from './HomeMarketplaceModal';

const featuredNFTs = [
  {
    id: '1',
    title: 'Sacred Buffalo Spirit',
    artist: 'LakotaDreams',
    price: 250,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=600&fit=crop',
    description: 'A powerful representation of the buffalo spirit, symbolizing abundance and gratitude in Lakota tradition.',
    hasVoiceStory: true
  },
  {
    id: '2',
    title: 'Thunderbird Rising',
    artist: 'CoastalArtist',
    price: 420,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop',
    description: 'The Thunderbird brings storms and renewal, a guardian of the Pacific Northwest tribes.',
    hasVoiceStory: true
  },
  {
    id: '3',
    title: 'Grandmother Moon',
    artist: 'LunarTales',
    price: 275,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1200&h=600&fit=crop',
    description: 'Grandmother Moon watches over us, guiding through cycles of change and renewal.',
    hasVoiceStory: false
  }
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'details' | 'offer'>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlaying && !activeModal) {
        setCurrentIndex((prev) => (prev + 1) % featuredNFTs.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeModal, isPlaying]);

  const currentNFT = featuredNFTs[currentIndex];
  const currentModalItem: HomeMarketplaceItem = {
    id: currentNFT.id,
    title: currentNFT.title,
    creator: currentNFT.artist,
    image: currentNFT.image,
    price: currentNFT.price,
    currency: currentNFT.currency,
    description: currentNFT.description,
    detailHref: `/marketplace/item/${currentNFT.id}`,
    artistHref: `/artist/${currentNFT.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredNFTs.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredNFTs.length) % featuredNFTs.length);

  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentNFT.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex h-full max-w-7xl items-start px-6 pb-16 pt-20">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0b0b0b]/75 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-sm font-medium text-[#d4af37]">Indigenous-led marketplace</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#d4af37]/60">Hero spotlight</span>
          </div>

          <h1 className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl">Support Indigenous creators directly.</h1>

          <p className="mb-3 text-xl font-medium leading-relaxed text-[#f4e4a6] md:text-2xl">
            Shop art, goods, experiences, and knowledge while directly supporting Indigenous communities worldwide.
          </p>

          <p className="mb-5 text-lg leading-relaxed text-gray-200 md:text-xl">
            Discover a living Indigenous-led ecosystem for collecting, learning, booking, and backing community projects where most of every purchase goes back to creators and communities.
          </p>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/digital-arts"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0ba43] to-[#b8941f] px-10 py-[18px] text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#d4af37]/30"
            >
              Explore Marketplace
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/creator-hub"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#0b0b0b]/55 px-8 py-4 text-base font-semibold text-[#d4af37] transition-all hover:bg-[#d4af37]/10"
            >
              Become a Creator
            </Link>
            <Link
              href="/launchpad"
              className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[#f4e4a6] transition-colors hover:text-white"
            >
              Support Community Projects
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mb-6 flex flex-col gap-2 text-sm text-gray-300 md:flex-row md:flex-wrap md:gap-4">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Most earnings go directly to creators</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Verified Indigenous creators across the ecosystem</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Community-supported marketplace</span>
          </div>

          <div className="mb-6 rounded-2xl border border-[#d4af37]/20 bg-black/35 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#d4af37]/75">Hero spotlight</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#f3d57c]">
                Featured by Indigena
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">{currentNFT.title}</h2>
            <p className="mt-2 text-base text-[#d4af37]">
              by <span className="font-semibold">{currentNFT.artist}</span>
            </p>
            <p className="mt-3 text-base leading-relaxed text-gray-300">{currentNFT.description}</p>
            <p className="mt-3 text-sm font-medium text-[#f4e4a6]">Seen by every visitor arriving on the homepage.</p>
          </div>

          {currentNFT.hasVoiceStory && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-[#d4af37]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#d4af37]/20">
                {isPlaying ? <Volume2 size={18} className="text-[#d4af37]" /> : <Play size={18} className="ml-0.5 text-[#d4af37]" />}
              </div>
              <span className="text-sm">Listen to Artist Story</span>
            </button>
          )}

          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div>
              <p className="mb-1 text-sm text-gray-500">Featured price</p>
              <p className="text-3xl font-bold secondary-gradient">
                {currentNFT.price} {currentNFT.currency}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('details')}
              className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] px-8 py-3 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#d4af37]/30"
            >
              View Featured Work
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('offer')}
              className="primary-glow rounded-full border border-[#DC143C] px-8 py-3 font-semibold text-[#DC143C] transition-all hover:bg-[#DC143C]/10"
            >
              Make Offer
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute bottom-24 left-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#DC143C]/30 bg-black/50 text-[#DC143C] transition-all hover:bg-[#DC143C]/20"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute bottom-24 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#DC143C]/30 bg-black/50 text-[#DC143C] transition-all hover:bg-[#DC143C]/20"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {featuredNFTs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-[#DC143C]' : 'w-2 bg-[#DC143C]/30 hover:bg-[#DC143C]/50'}`}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 shimmer" />
      <HomeMarketplaceModal
        item={currentModalItem}
        mode={activeModal || 'details'}
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
      />
    </section>
  );
}
