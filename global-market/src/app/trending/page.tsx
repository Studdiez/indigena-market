'use client';

import { useEffect, useMemo, useState } from 'react';
import { Flame, TrendingUp, Clock, Eye, Heart, ArrowUpRight, Filter, Users, Sparkles, BadgeCheck, Activity, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import TrendingTakeover from '@/app/components/trending/TrendingTakeover';
import FeaturedTrending from '@/app/components/trending/FeaturedTrending';
import MarketTrendsChart from '@/app/components/trending/MarketTrendsChart';
import TopGainersLosers from '@/app/components/trending/TopGainersLosers';
import NewlyListed from '@/app/components/trending/NewlyListed';
import RisingStars from '@/app/components/trending/RisingStars';
import UnderpricedGems from '@/app/components/trending/UnderpricedGems';
import CollectionSpotlights from '@/app/components/trending/CollectionSpotlights';
import PromotedCreators from '@/app/components/trending/PromotedCreators';
import ActivityFeed from '@/app/components/trending/ActivityFeed';
import { fetchDigitalArtPage, type DigitalArtApiListing } from '@/app/lib/digitalArtApi';
import { PlacementPill, placementFeaturedCardClass } from '@/app/components/placements/PremiumPlacement';

// Mock trending data
const mockTrendingItems = [
  {
    id: '1',
    rank: 1,
    title: 'Sacred Buffalo Spirit',
    creator: 'LakotaDreams',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop',
    price: 250,
    currency: 'INDI',
    likes: 1250,
    views: 8900,
    sales: 45,
    change24h: +23.5,
    isVerified: true,
    hot: true
  },
  {
    id: '2',
    rank: 2,
    title: 'Thunderbird Rising',
    creator: 'CoastalArtist',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    price: 420,
    currency: 'INDI',
    likes: 980,
    views: 6700,
    sales: 32,
    change24h: +18.2,
    isVerified: true,
    hot: true
  },
  {
    id: '3',
    rank: 3,
    title: 'Medicine Wheel',
    creator: 'PlainsElder',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop',
    price: 500,
    currency: 'INDI',
    likes: 856,
    views: 5400,
    sales: 28,
    change24h: +15.7,
    isVerified: true,
    hot: false
  },
  {
    id: '4',
    rank: 4,
    title: 'Dreamcatcher Collection',
    creator: 'OjibweArt',
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&h=400&fit=crop',
    price: 95,
    currency: 'INDI',
    likes: 723,
    views: 4800,
    sales: 67,
    change24h: +12.4,
    isVerified: false,
    hot: false
  },
  {
    id: '5',
    rank: 5,
    title: 'Eagle Feather Ceremony',
    creator: 'HopiVision',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
    price: 350,
    currency: 'INDI',
    likes: 654,
    views: 4200,
    sales: 21,
    change24h: +9.8,
    isVerified: true,
    hot: false
  },
  {
    id: '6',
    rank: 6,
    title: 'Four Directions',
    creator: 'SacredEarth',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    price: 600,
    currency: 'INDI',
    likes: 598,
    views: 3800,
    sales: 15,
    change24h: +8.3,
    isVerified: true,
    hot: false
  }
];

const mockTrendingCreators = [
  { id: '1', name: 'LakotaDreams', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', sales: 234, followers: '12.5K', change: '+45%' },
  { id: '2', name: 'CoastalArtist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', sales: 189, followers: '9.8K', change: '+38%' },
  { id: '3', name: 'PlainsElder', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', sales: 156, followers: '8.2K', change: '+32%' },
  { id: '4', name: 'HopiVision', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', sales: 134, followers: '7.1K', change: '+28%' },
  { id: '5', name: 'OjibweArt', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', sales: 112, followers: '6.5K', change: '+24%' }
];

export default function TrendingPage() {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activePillar, setActivePillar] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [trendingItems, setTrendingItems] = useState(mockTrendingItems);
  const [trendingCreators, setTrendingCreators] = useState(mockTrendingCreators);
  const [usingMockFallback, setUsingMockFallback] = useState(true);
  const [loadingLive, setLoadingLive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const loadTrending = async () => {
      setLoadingLive(true);
      try {
        const result = await fetchDigitalArtPage({ sort: 'popular', page: 1, limit: 12 });
        if (!active) return;
        const rows = result.listings || [];
        if (rows.length === 0) {
          setTrendingItems(mockTrendingItems);
          setTrendingCreators(mockTrendingCreators);
          setUsingMockFallback(true);
          return;
        }
        const mappedItems = rows.slice(0, 12).map((row: DigitalArtApiListing, idx) => ({
          id: String(row.listingId || row._id || `live-${idx + 1}`),
          rank: idx + 1,
          title: String(row.title || 'Untitled Artwork'),
          creator: row.creatorAddress ? `Creator ${row.creatorAddress.slice(-4).toUpperCase()}` : 'Indigenous Creator',
          image: String(row.content?.previewUrl || row.content?.images?.[0] || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop'),
          price: Number(row.pricing?.buyNowPrice || row.pricing?.basePrice?.amount || row.pricing?.startingBid || 0),
          currency: String(row.pricing?.basePrice?.currency || 'INDI'),
          likes: Number(row.stats?.favorites || 0),
          views: Number(row.stats?.views || 0),
          sales: Number(row.stats?.sales || 0),
          change24h: Number((Math.max(0, Number(row.stats?.sales || 0)) * 1.8).toFixed(1)),
          isVerified: row.compliance?.creatorVerificationStatus === 'verified',
          hot: idx < 2
        }));
        const creatorAggregate = new Map<string, { sales: number; views: number }>();
        mappedItems.forEach((item) => {
          const key = item.creator;
          const found = creatorAggregate.get(key) || { sales: 0, views: 0 };
          found.sales += Number(item.sales || 0);
          found.views += Number(item.views || 0);
          creatorAggregate.set(key, found);
        });
        const mappedCreators = Array.from(creatorAggregate.entries())
          .map(([name, metrics], idx) => ({
            id: `creator-${idx + 1}`,
            name,
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
            sales: metrics.sales,
            followers: `${Math.max(1, Math.round(metrics.views / 100))}K`,
            change: `+${Math.max(1, Math.round(metrics.sales * 1.4))}%`
          }))
          .slice(0, 5);

        setTrendingItems(mappedItems);
        setTrendingCreators(mappedCreators.length > 0 ? mappedCreators : mockTrendingCreators);
        setUsingMockFallback(false);
      } catch {
        if (!active) return;
        setTrendingItems(mockTrendingItems);
        setTrendingCreators(mockTrendingCreators);
        setUsingMockFallback(true);
      } finally {
        if (active) setLoadingLive(false);
      }
    };
    void loadTrending();
    return () => {
      active = false;
    };
  }, [timeFilter]);

  const filteredTrendingItems = useMemo(() => {
    if (categoryFilter === 'all' || categoryFilter === 'digital') return trendingItems;
    return [];
  }, [categoryFilter]);

  const spotlightItem = filteredTrendingItems[0];
  const secondaryItems = filteredTrendingItems.slice(1, 4);
  const compactTrendingItems = filteredTrendingItems.slice(0, 3);
  const totalVolume = useMemo(
    () => filteredTrendingItems.reduce((sum, item) => sum + item.price * Math.max(1, item.sales), 0),
    [filteredTrendingItems]
  );
  const totalSales = useMemo(
    () => filteredTrendingItems.reduce((sum, item) => sum + item.sales, 0),
    [filteredTrendingItems]
  );
  const avgChange = useMemo(
    () => filteredTrendingItems.length > 0
      ? filteredTrendingItems.reduce((sum, item) => sum + item.change24h, 0) / filteredTrendingItems.length
      : 0,
    [filteredTrendingItems]
  );
  const getTrendingReasons = (item: typeof mockTrendingItems[number]) => {
    const reasons: string[] = [];
    if (item.change24h >= 20) reasons.push('Rapid growth');
    if (item.sales >= 30) reasons.push('High demand');
    if (item.hot) reasons.push('Limited drop');
    if (item.isVerified) reasons.push('Cultural spotlight');
    return reasons.slice(0, 3);
  };
  const featuredSidebarCreator = trendingCreators[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <Sidebar 
        activePillar={activePillar} 
        onPillarChange={setActivePillar}
        isCollapsed={isCollapsed}
        onCollapseChange={setIsCollapsed}
      />
      
      {/* Main Content */}
      <div className="flex-1 min-w-0 p-6 transition-all duration-300">
      {/* Trending Takeover - Premium Revenue Spot */}
      <TrendingTakeover />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DC143C] to-[#8B0000] flex items-center justify-center">
            <Flame size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Trending Now</h1>
            <p className="text-gray-400">
              Discover what&apos;s hot in the Indigenous art world {loadingLive ? '- syncing live data...' : usingMockFallback ? '- preview data' : '- live'}
            </p>
          </div>
        </div>
        <p className="max-w-3xl text-sm text-gray-500">
          The real-time pulse of Indigenous culture, creators, and marketplace demand. Follow what is rising, what is moving, and where attention is concentrating right now.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Time Filter */}
        <div className="flex items-center bg-[#141414] rounded-lg p-1 border border-[#d4af37]/20">
          {['24h', '7d', '30d', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === period
                  ? 'bg-[#d4af37] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#d4af37]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#141414] border border-[#d4af37]/20 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Categories</option>
            <option value="digital">Digital Art</option>
            <option value="physical">Physical Items</option>
            <option value="music">Music</option>
            <option value="photography">Photography</option>
          </select>
        </div>
      </div>

      {/* Trending Spotlight + Market Overview */}
      {spotlightItem ? (
        <section className="mb-10 grid gap-6 xl:grid-cols-[1.35fr,0.65fr]">
          <article className="overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#141414]">
            <div className="grid gap-0 md:grid-cols-[1.15fr,0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <img
                  src={spotlightItem.image}
                  alt={spotlightItem.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/55 to-transparent" />
                <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#d4af37]/35 bg-[#0a0a0a]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3d57c]">
                    Trending Spotlight
                  </span>
                  <span className="rounded-full bg-[#DC143C] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    +{spotlightItem.change24h}% this {timeFilter === 'all' ? 'cycle' : timeFilter}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="mb-2 text-sm uppercase tracking-[0.26em] text-[#d4af37]">Market pulse spotlight</p>
                  <h2 className="max-w-xl text-3xl font-bold text-white">{spotlightItem.title}</h2>
                  <p className="mt-2 text-sm text-[#f0dfb1]">by {spotlightItem.creator}</p>
                  <p className="mt-3 max-w-xl text-sm text-gray-300">
                    Rapid marketplace traction driven by strong engagement, verified creator trust, and concentrated buyer demand around a premium cultural drop.
                  </p>
                  <div className="mt-4 rounded-xl border border-[#d4af37]/25 bg-gradient-to-br from-[#1b1407]/90 via-black/35 to-[#0f0f0f]/95 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.2)]">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">Why it&apos;s trending</p>
                    <div className="mt-3 grid gap-2">
                      {getTrendingReasons(spotlightItem).map((reason) => {
                        const iconMap = {
                          'Rapid growth': TrendingUp,
                          'High demand': Flame,
                          'Limited drop': Clock,
                          'Cultural spotlight': Sparkles
                        } as const;
                        const Icon = iconMap[reason as keyof typeof iconMap] || Sparkles;
                        return (
                          <div key={reason} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-[#e9d6a0]">
                            <Icon size={14} className="text-[#d4af37]" />
                            <span>{reason}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-[#e9d6a0]">
                        <TrendingUp size={14} className="text-[#d4af37]" />
                        <span>+{spotlightItem.change24h}% growth in marketplace momentum</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Signals combine demand, creator trust, sales momentum, and drop scarcity.</p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => router.push(`/digital-arts?id=${spotlightItem.id}`, { scroll: false })}
                      className="rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-[#f4e4a6]"
                    >
                      View collection
                    </button>
                    <Link
                      href="/marketplace/promote"
                      className="rounded-lg border border-[#d4af37]/30 bg-black/25 px-5 py-3 text-sm text-[#d4af37] transition-all hover:border-[#d4af37]/55 hover:bg-[#d4af37]/10"
                    >
                      Book promoted trending
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between border-l border-[#d4af37]/10 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Spotlight readout</p>
                  <div className="mt-4 grid gap-3">
                    {[
                      { label: 'Current price', value: `${spotlightItem.price} ${spotlightItem.currency}` },
                      { label: 'Views', value: `${(spotlightItem.views / 1000).toFixed(1)}K` },
                      { label: 'Likes', value: `${spotlightItem.likes}` },
                      { label: 'Sales', value: `${spotlightItem.sales}` },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{metric.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-[#d4af37]/20 bg-[#0f0f0f] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">Promoted trending</p>
                  <p className="mt-2 text-sm text-white">This top slot is reserved for high-visibility collections and creator campaigns.</p>
                  <p className="mt-1 text-xs text-gray-400">Seen by every visitor who checks the market pulse.</p>
                </div>
              </div>
            </div>
          </article>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#141414] p-5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#d4af37]" />
                <h2 className="text-lg font-bold text-white">Market Overview</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {[
                  { label: 'This week\'s marketplace sales', value: `${totalVolume.toLocaleString()} INDI`, icon: TrendingUp },
                  { label: 'Top category right now', value: categoryFilter === 'all' ? 'Digital art' : categoryFilter, icon: ArrowUpRight },
                  { label: 'Active buyers', value: `${Math.max(12, totalSales * 2)}`, icon: Users },
                  { label: 'Creators with momentum', value: `${trendingCreators.length}`, icon: BadgeCheck },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Icon size={14} />
                      <span className="text-[11px] uppercase tracking-[0.22em]">{label}</span>
                    </div>
                    <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#141414] p-5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[#d4af37]" />
                <h3 className="text-lg font-bold text-white">Trending Now</h3>
              </div>
              <div className="mt-4 space-y-3">
                {secondaryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/digital-arts?id=${item.id}`, { scroll: false })}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left transition-colors hover:border-[#d4af37]/30"
                  >
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.creator}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {getTrendingReasons(item).slice(0, 2).map((reason) => (
                          <span key={reason} className="rounded-full bg-[#d4af37]/10 px-2 py-0.5 text-[10px] text-[#d4af37]">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-400">+{item.change24h}%</p>
                      <p className="text-xs text-gray-500">{item.price} INDI</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mb-12">
        <MarketTrendsChart timeRange={timeFilter} />
      </div>
      <div className="mb-12">
        <TopGainersLosers />
      </div>
      <div className="mb-12">
        <FeaturedTrending timeFilter={timeFilter} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <RisingStars />
          <UnderpricedGems />
          <CollectionSpotlights />
          <NewlyListed />

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <TrendingUp size={20} className="text-[#d4af37]" />
                Top Trending Items
              </h2>
              <span className="text-sm text-gray-400">Ranked by current marketplace pull</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredTrendingItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`group overflow-hidden transition-all hover:border-[#d4af37]/30 hover:shadow-lg hover:shadow-[#d4af37]/5 ${
                    index === 0 ? placementFeaturedCardClass : 'rounded-xl border border-[#d4af37]/10 bg-[#141414]'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                      item.rank <= 3
                        ? 'bg-[#d4af37] text-black'
                        : 'border border-[#d4af37]/30 bg-[#141414] text-white'
                    }`}>
                      #{item.rank}
                    </div>
                    {item.hot && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#DC143C] px-2 py-1">
                        <Flame size={12} className="text-white" />
                        <span className="text-xs font-bold text-white">HOT</span>
                      </div>
                    )}
                    {index === 0 ? (
                      <div className="absolute left-3 top-14">
                        <PlacementPill icon={Sparkles}>Boosted</PlacementPill>
                      </div>
                    ) : null}
                    {item.isVerified && (
                      <div className="absolute bottom-3 left-3 rounded-full bg-[#d4af37] px-2 py-1 text-[11px] font-semibold text-black">
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 truncate text-white font-semibold">{item.title}</h3>
                    <p className="mb-3 text-sm text-[#d4af37]">by {item.creator}</p>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {getTrendingReasons(item).map((reason) => (
                        <span key={reason} className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/8 px-2 py-1 text-[11px] text-[#d4af37]">
                          {reason}
                        </span>
                      ))}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {(item.views / 1000).toFixed(1)}K
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {item.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-400">
                        <ArrowUpRight size={14} />
                        {item.change24h}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Current Price</p>
                        <p className="text-lg font-bold text-[#d4af37]">{item.price} {item.currency}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/digital-arts?id=${item.id}`, { scroll: false })}
                        className="rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-black"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTrendingItems.length === 0 && (
              <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-[#141414] p-6 text-center">
                <p className="font-medium text-white">No trending items for this category yet.</p>
                <p className="mt-1 text-sm text-gray-400">Try All Categories or Digital Art to see live results.</p>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="mt-4 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-black"
                >
                  Reset Category Filter
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-[#d4af37]/20 bg-[#141414] p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Mini Market Pulse</h3>
            <p className="mb-4 text-xs text-gray-400">Quick movers worth watching right now.</p>
            <div className="space-y-3">
              {compactTrendingItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/digital-arts?id=${item.id}`, { scroll: false })}
                  className="flex w-full items-center gap-3 rounded-lg bg-[#0a0a0a] p-3 text-left transition-colors hover:bg-[#1a1a1a]"
                >
                  <span className="w-5 text-sm font-bold text-[#d4af37]">{index + 1}</span>
                  <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.creator}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-400">+{item.change24h}%</span>
                </button>
              ))}
            </div>
          </div>

          {featuredSidebarCreator ? (
            <div className={`${placementFeaturedCardClass} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-[#d4af37]" />
                  <h3 className="text-lg font-bold text-white">Featured Creator</h3>
                </div>
                <PlacementPill icon={Sparkles}>Premium</PlacementPill>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <img src={featuredSidebarCreator.avatar} alt={featuredSidebarCreator.name} className="h-16 w-16 rounded-full object-cover border border-[#d4af37]/30" />
                <div className="min-w-0">
                  <p className="truncate text-white font-semibold">{featuredSidebarCreator.name}</p>
                  <p className="text-sm text-gray-400">{featuredSidebarCreator.followers} followers</p>
                  <p className="text-sm text-green-400">{featuredSidebarCreator.change} this cycle</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                Featured placement for creators building momentum and looking for concentrated discovery in the market pulse.
              </p>
              <div className="mt-4 flex gap-2">
                <Link href={`/creator/${featuredSidebarCreator.id}`} className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#f4e4a6]">
                  View creator
                </Link>
                <Link href="/creator/promote" className="rounded-lg border border-[#d4af37]/30 px-4 py-2 text-sm text-[#d4af37] hover:bg-[#d4af37]/10">
                  Promote profile
                </Link>
              </div>
            </div>
          ) : null}

          <PromotedCreators />
          <ActivityFeed />

          <div className="rounded-xl border border-[#d4af37]/10 bg-[#141414] p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <Clock size={20} className="text-[#d4af37]" />
              Trending Creators
            </h2>

            <div className="space-y-4">
              {trendingCreators.map((creator, index) => (
                <div
                  key={creator.id}
                  className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-[#1a1a1a]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-bold text-[#d4af37]">{index + 1}</span>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{creator.name}</p>
                      <p className="text-xs text-gray-400">{creator.followers} followers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-400">{creator.change}</p>
                      <p className="text-xs text-gray-500">{creator.sales} sales</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/digital-arts"
              className="mt-4 block w-full rounded-lg border border-[#d4af37]/30 py-2 text-center text-sm text-[#d4af37] transition-all hover:bg-[#d4af37]/10"
            >
              View All Creators
            </Link>
          </div>

          <div className="rounded-xl border border-[#d4af37]/10 bg-[#141414] p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['#SacredGeometry', '#Beadwork', '#NativeAmerican', '#IndigenousArt', '#Traditional', '#Contemporary', '#Spiritual', '#Nature'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/community?tag=${encodeURIComponent(tag)}`, { scroll: false })}
                  className="cursor-pointer rounded-full border border-transparent bg-[#1a1a1a] px-3 py-1 text-sm text-gray-400 transition-all hover:border-[#d4af37]/30 hover:text-[#d4af37]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}




