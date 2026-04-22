'use client';

import { useState } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import NFTCard from '../NFTCard';
import HomeMarketplaceModal, { type HomeMarketplaceItem } from './HomeMarketplaceModal';
import { PlacementPill, placementFeaturedCardClass } from '@/app/components/placements/PremiumPlacement';

const trendingNFTs = [
  {
    id: 't1',
    title: 'Sacred Buffalo Spirit',
    creator: 'LakotaDreams',
    price: 250,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop',
    likes: 128,
    views: 1045,
    isVerified: true
  },
  {
    id: 't2',
    title: 'Navajo Weaving Pattern #4',
    creator: 'WeavingWoman',
    price: 180,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
    likes: 89,
    views: 723,
    isVerified: true
  },
  {
    id: 't3',
    title: 'Thunderbird Rising',
    creator: 'CoastalArtist',
    price: 420,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    likes: 256,
    views: 2103,
    isVerified: false
  },
  {
    id: 't4',
    title: 'Medicine Wheel',
    creator: 'PlainsElder',
    price: 500,
    currency: 'INDI',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop',
    likes: 312,
    views: 2890,
    isVerified: true
  },
];

export default function TrendingSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeItem, setActiveItem] = useState<HomeMarketplaceItem | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('trending-container');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="bg-[#0a0a0a] px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC143C] to-[#8B0000] flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <p className="text-sm text-gray-500">
                A swipeable strip of the fastest-rising works this week <span className="text-green-400/80">based on live platform activity</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-[#141414] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-[#141414] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div 
          id="trending-container"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingNFTs.map((nft, index) => (
            <div key={nft.id} className={`relative flex-shrink-0 snap-start ${index === 0 ? 'w-[28rem]' : 'w-[19rem]'}`}>
              {index === 0 ? (
                <div className={`${placementFeaturedCardClass} p-4`}>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#DC143C] to-[#8B0000] text-sm font-bold text-white shadow-lg">
                        #1
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <PlacementPill tone="rose">Trending spotlight</PlacementPill>
                        <PlacementPill>Featured by Indigena</PlacementPill>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-white">{nft.title}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#d4af37]/75">Featured by Indigena</p>
                        <p className="mt-1 text-sm text-[#d4af37]">by {nft.creator}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-200">
                          The fastest-rising work on the homepage right now, drawing {nft.views.toLocaleString()} views and {nft.likes} likes this week.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Current price</p>
                      <p className="secondary-gradient text-3xl font-bold">{nft.price} {nft.currency}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveItem({
                          id: nft.id,
                          title: nft.title,
                          creator: nft.creator,
                          image: nft.image,
                          price: nft.price,
                          currency: nft.currency,
                          description: `${nft.title} is one of the fastest-rising works on the homepage, currently drawing ${nft.views.toLocaleString()} views and ${nft.likes} likes this week.`,
                          detailHref: `/marketplace/item/${nft.id}`,
                          artistHref: `/artist/${nft.creator.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                        })
                      }
                      className="rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8941f] px-5 py-3 font-semibold text-black transition-all hover:shadow-lg hover:shadow-[#d4af37]/25"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {index < 3 && (
                    <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#DC143C] to-[#8B0000] text-sm font-bold text-white shadow-lg">
                      #{index + 1}
                    </div>
                  )}
                  <NFTCard
                    {...nft}
                    onViewDetails={() =>
                      setActiveItem({
                        id: nft.id,
                        title: nft.title,
                        creator: nft.creator,
                        image: nft.image,
                        price: nft.price,
                        currency: nft.currency,
                        description: `${nft.title} is one of the fastest-rising works on the homepage, currently drawing ${nft.views.toLocaleString()} views and ${nft.likes} likes this week.`,
                        detailHref: `/marketplace/item/${nft.id}`,
                        artistHref: `/artist/${nft.creator.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                      })
                    }
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <HomeMarketplaceModal item={activeItem} mode="details" isOpen={Boolean(activeItem)} onClose={() => setActiveItem(null)} />
    </section>
  );
}

