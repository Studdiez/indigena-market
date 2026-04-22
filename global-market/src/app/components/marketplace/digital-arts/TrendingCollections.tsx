'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Crown, Sparkles, Star, ShoppingCart } from 'lucide-react';

const boostedCollection = {
  id: 'boost-1',
  name: 'Eagle Clan Ancestral Works',
  creator: 'SkyPainter',
  image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=400&fit=crop',
  items: 30,
  floorPrice: 220,
  volume: '6.8K',
  owners: 201,
};

const collections = [
  {
    id: '1',
    name: 'Sacred Geometry Series',
    creator: 'ThunderVoice',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
    items: 12,
    floorPrice: 150,
    volume: '2.4K',
    owners: 89,
  },
  {
    id: '2',
    name: 'Coastal Formline',
    creator: 'HaidaMaster',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop',
    items: 24,
    floorPrice: 200,
    volume: '4.1K',
    owners: 156,
  },
  {
    id: '3',
    name: 'Plains Spirit Animals',
    creator: 'LakotaDreams',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&h=300&fit=crop',
    items: 8,
    floorPrice: 300,
    volume: '1.8K',
    owners: 67,
  },
  {
    id: '4',
    name: 'Desert Symbols',
    creator: 'NavajoWeaver',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=300&h=300&fit=crop',
    items: 16,
    floorPrice: 125,
    volume: '3.2K',
    owners: 112,
  },
];

function CollectionModal({ collection, onClose }: { collection: typeof collections[0] | typeof boostedCollection; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#141414] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 overflow-hidden">
          <img src={collection.image} alt={collection.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
            X
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-lg font-bold text-white">{collection.name}</p>
            <p className="text-sm text-gray-400">by {collection.creator}</p>
          </div>
        </div>
        {confirmed ? (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/20">
              <span className="text-2xl text-[#d4af37]">OK</span>
            </div>
            <p className="font-semibold text-white">Added to Watchlist!</p>
          </div>
        ) : (
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-[#d4af37]">{collection.items}</p>
                <p className="text-xs text-gray-500">Items</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-white">{collection.floorPrice}</p>
                <p className="text-xs text-gray-500">Floor</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-[#d4af37]">{collection.volume}</p>
                <p className="text-xs text-gray-500">Volume</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-white">{collection.owners}</p>
                <p className="text-xs text-gray-500">Owners</p>
              </div>
            </div>
            <button
              onClick={() => {
                setConfirmed(true);
                setTimeout(onClose, 1600);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3 font-bold text-black transition-colors hover:bg-[#f4e4a6]"
            >
              <ShoppingCart size={16} /> Browse Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendingCollections() {
  const [modalCollection, setModalCollection] = useState<typeof collections[0] | typeof boostedCollection | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <TrendingUp size={20} className="text-[#d4af37]" />
          Trending Collections
        </h3>
        <Link href="/digital-arts" className="flex items-center gap-1 text-sm text-[#d4af37] transition-colors hover:text-[#f4e4a6]">
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <div
        className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl border border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10"
        onClick={() => setModalCollection(boostedCollection)}
      >
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-[#d4af37] px-2.5 py-1 text-xs font-bold text-black">
          <Crown size={12} />
          Featured Collection / Sponsored
        </div>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-[#d4af37]/30 bg-black/60 px-2 py-1 text-xs text-[#d4af37] backdrop-blur-sm">
          <Sparkles size={10} />
          Featured
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 overflow-hidden md:h-auto md:w-2/5">
            <img
              src={boostedCollection.image}
              alt={boostedCollection.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-[#141414] md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent md:hidden" />
          </div>
          <div className="flex-1 bg-[#141414] p-5">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">{boostedCollection.name}</h4>
                <p className="text-sm text-gray-400">by {boostedCollection.creator}</p>
              </div>
              <Star size={20} className="text-[#d4af37]" fill="currentColor" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-[#d4af37]">{boostedCollection.items}</p>
                <p className="text-xs text-gray-500">Items</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-white">{boostedCollection.floorPrice}</p>
                <p className="text-xs text-gray-500">Floor</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-[#d4af37]">{boostedCollection.volume}</p>
                <p className="text-xs text-gray-500">Volume</p>
              </div>
              <div className="rounded-lg bg-[#0a0a0a] p-3 text-center">
                <p className="font-bold text-white">{boostedCollection.owners}</p>
                <p className="text-xs text-gray-500">Owners</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalCollection(boostedCollection);
              }}
              className="mt-4 w-full rounded-lg bg-[#d4af37] py-2.5 font-semibold text-black transition-colors hover:bg-[#f4e4a6]"
            >
              View Collection
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {collections.map((collection, idx) => (
          <div
            key={collection.id}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#d4af37]/10 bg-[#141414] transition-all hover:border-[#d4af37]/30"
            onClick={() => setModalCollection(collection)}
          >
            <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70">
              <span className="text-xs font-bold text-[#d4af37]">#{idx + 2}</span>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <img
                src={collection.image}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-lg bg-[#d4af37] px-3 py-1.5 text-xs font-semibold text-black">View Collection</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="truncate font-semibold text-white">{collection.name}</h4>
                <p className="text-xs text-gray-400">by {collection.creator}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 text-center">
              <div>
                <p className="text-sm font-bold text-[#d4af37]">{collection.items}</p>
                <p className="text-xs text-gray-500">Items</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{collection.floorPrice} INDI</p>
                <p className="text-xs text-gray-500">Floor</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{collection.owners}</p>
                <p className="text-xs text-gray-500">Owners</p>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Volume</span>
                <span className="font-medium text-[#d4af37]">{collection.volume} INDI</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalCollection && <CollectionModal collection={modalCollection} onClose={() => setModalCollection(null)} />}
    </div>
  );
}
