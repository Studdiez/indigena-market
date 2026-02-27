import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { nftApi } from "@/components/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Flame, Clock, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import NFTCard from "@/components/shared/NFTCard";
import CultureFilter from "@/components/shared/CultureFilter";
import EmptyState from "@/components/shared/EmptyState";

const sortOptions = [
  { value: "-created_date", label: "Newest", icon: Clock },
  { value: "-views", label: "Most Viewed", icon: TrendingUp },
  { value: "-wishlist_count", label: "Most Loved", icon: Flame },
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cultureFilter, setCultureFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [priceRange, setPriceRange] = useState("all");

  const { data: nfts = [], isLoading } = useQuery({
    queryKey: ["nfts", cultureFilter, sortBy],
    queryFn: async () => {
      // Try custom backend first, fall back to Base44 DB
      try {
        const data = await nftApi.getAll();
        let results = Array.isArray(data) ? data : (data.nfts || data.data || []);
        results = results.filter(n => n.status === "listed");
        if (cultureFilter !== "all") results = results.filter(n => n.culture === cultureFilter);
        return results;
      } catch {
        const filter = { status: "listed" };
        if (cultureFilter !== "all") filter.culture = cultureFilter;
        return base44.entities.NFT.filter(filter, sortBy, 50);
      }
    },
  });

  const filteredNfts = nfts.filter((nft) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        nft.title?.toLowerCase().includes(q) ||
        nft.artist_name?.toLowerCase().includes(q) ||
        nft.cultural_tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  }).filter((nft) => {
    if (priceRange === "all") return true;
    if (priceRange === "low") return nft.price_indi <= 100;
    if (priceRange === "mid") return nft.price_indi > 100 && nft.price_indi <= 1000;
    if (priceRange === "high") return nft.price_indi > 1000;
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
          Discover Indigenous
          <span className="block text-[#B51D19]">Digital Art</span>
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-xl">
          Collect NFTs from Māori, Aboriginal, and Pacific Islander creators. Every purchase supports cultural preservation.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search art, artists, cultures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white placeholder:text-gray-600 h-11 rounded-xl"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-white">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Prices</SelectItem>
              <SelectItem value="low" className="text-white">Under 100 INDI</SelectItem>
              <SelectItem value="mid" className="text-white">100–1,000 INDI</SelectItem>
              <SelectItem value="high" className="text-white">1,000+ INDI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CultureFilter value={cultureFilter} onChange={setCultureFilter} />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
              <div className="aspect-square bg-[#2E2E2E] rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-[#2E2E2E] rounded w-1/3" />
                <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
                <div className="h-3 bg-[#2E2E2E] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNfts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No NFTs found"
          description="Try adjusting your search or filters to discover more indigenous digital art."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNfts.map((nft, i) => (
            <NFTCard key={nft.id} nft={nft} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}