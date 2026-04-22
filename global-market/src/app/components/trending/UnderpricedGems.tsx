'use client';

import { Gem, Sparkles, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Eye, Heart, Clock } from 'lucide-react';

interface UnderpricedGemsProps {
  limit?: number;
}

const underpricedGems = [
  {
    id: 'gem-1',
    title: 'Ancient Wisdom Keeper',
    creator: 'ElderArts',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop',
    price: 180,
    estimatedValue: 450,
    currency: 'INDI',
    discount: '60%',
    likes: 234,
    views: 1200,
    reason: 'Below artist average',
    timeLeft: '4h 30m',
    isAuction: true,
    rarity: 'Rare'
  },
  {
    id: 'gem-2',
    title: 'Spirit Guide Vision',
    creator: 'VisionaryCrafts',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    price: 220,
    estimatedValue: 500,
    currency: 'INDI',
    discount: '56%',
    likes: 189,
    views: 890,
    reason: 'High engagement, low price',
    timeLeft: '12h',
    isAuction: true,
    rarity: 'Epic'
  },
  {
    id: 'gem-3',
    title: 'Traditional Healing',
    creator: 'MedicineArts',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop',
    price: 150,
    estimatedValue: 350,
    currency: 'INDI',
    discount: '57%',
    likes: 156,
    views: 678,
    reason: 'Undervalued collection',
    timeLeft: '2h 15m',
    isAuction: false,
    rarity: 'Uncommon'
  },
  {
    id: 'gem-4',
    title: 'Sacred Earth Connection',
    creator: 'EarthKeepers',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=400&fit=crop',
    price: 195,
    estimatedValue: 420,
    currency: 'INDI',
    discount: '54%',
    likes: 267,
    views: 1450,
    reason: 'Rising artist',
    timeLeft: '6h 45m',
    isAuction: true,
    rarity: 'Rare'
  }
];

export default function UnderpricedGems({ limit = 4 }: UnderpricedGemsProps) {
  const featuredGem = underpricedGems[0];
  const supportingGems = underpricedGems.slice(1, limit);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] via-[#f4e4a6] to-[#b8941f] rounded-lg flex items-center justify-center">
            <Gem size={18} className="text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Undervalued Gems</h3>
            <p className="text-xs text-gray-400">Value opportunities with cultural demand and softer pricing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-full">
            <Sparkles size={12} />
            Algorithm Powered
          </div>
          <Link 
            href="/marketplace/gems"
            className="text-sm text-[#d4af37] hover:text-[#f4e4a6] transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <Link 
          href={`/marketplace/item/${featuredGem.id}`}
          className="group bg-[#141414] rounded-xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all hover:shadow-lg hover:shadow-[#d4af37]/10"
        >
          <div className="grid md:grid-cols-[1.15fr,0.85fr]">
            {/* Image */}
            <div className="relative aspect-[1.05] overflow-hidden">
              <img 
                src={featuredGem.image}
                alt={featuredGem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-60" />

              {/* Rarity Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#d4af37] text-black text-xs font-bold rounded">
                {featuredGem.rarity}
              </div>

              {/* Discount Badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded flex items-center gap-1">
                <TrendingUp size={10} />
                {featuredGem.discount} off
              </div>

              {/* Auction Badge */}
              {featuredGem.isAuction && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-[#DC143C] text-white text-xs font-medium rounded">
                  <Clock size={10} />
                  {featuredGem.timeLeft}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Reason */}
              <div className="flex items-center gap-1 mb-2">
                <AlertCircle size={12} className="text-[#d4af37]" />
                <span className="text-xs text-[#d4af37]">{featuredGem.reason}</span>
              </div>

              <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-[#d4af37] transition-colors">
                {featuredGem.title}
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Strong engagement, lower-than-expected pricing, and a closing window make this one of the sharpest value reads on the marketplace right now.
              </p>

              {/* Creator */}
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={featuredGem.creatorAvatar}
                  alt={featuredGem.creator}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="text-xs text-gray-400">{featuredGem.creator}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {featuredGem.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {featuredGem.likes}
                </span>
              </div>

              {/* Price Comparison */}
              <div className="pt-3 border-t border-[#d4af37]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="text-[#d4af37] font-bold">{featuredGem.price} INDI</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Est. Value</p>
                    <p className="text-gray-400 text-sm line-through">{featuredGem.estimatedValue} INDI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid gap-4">
          {supportingGems.map((item) => (
            <Link 
              key={item.id}
              href={`/marketplace/item/${item.id}`}
              className="group bg-[#141414] rounded-xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all hover:shadow-lg hover:shadow-[#d4af37]/10"
            >
              <div className="grid grid-cols-[96px,1fr] gap-3 p-3">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute left-2 top-2 px-2 py-0.5 bg-[#d4af37] text-black text-[10px] font-bold rounded">
                    {item.rarity}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">{item.title}</p>
                    <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">{item.discount}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#d4af37]">{item.reason}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>{item.creator}</span>
                    <span>•</span>
                    <span>{item.price} INDI</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye size={11} />{item.views}</span>
                    <span className="flex items-center gap-1"><Heart size={11} />{item.likes}</span>
                    {item.isAuction ? <span className="flex items-center gap-1 text-[#DC143C]"><Clock size={11} />{item.timeLeft}</span> : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <AlertCircle size={12} />
        <span>Estimated values are marketplace heuristics, not financial advice.</span>
      </div>
    </div>
  );
}
