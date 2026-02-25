import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import CultureFilter from "@/components/shared/CultureFilter";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  visual_art: "Visual Art",
  wearable_art: "Wearable Art",
  functional_art: "Functional Art",
  books: "Books",
  jewelry: "Jewelry",
  pottery: "Pottery",
  textiles: "Textiles",
  sculpture: "Sculpture",
};

export default function PhysicalMarket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cultureFilter, setCultureFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["physical-items", cultureFilter, categoryFilter],
    queryFn: () => {
      const filter = { status: "available" };
      if (cultureFilter !== "all") filter.culture = cultureFilter;
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.PhysicalItem.filter(filter, "-created_date", 50);
    },
  });

  const filtered = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.title?.toLowerCase().includes(q) || item.artist_name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Physical Items</h1>
        <p className="text-gray-400 mt-3 text-lg">Tangible art, wearables, and functional pieces shipped worldwide</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search physical items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white placeholder:text-gray-600 h-11 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CultureFilter value={cultureFilter} onChange={setCultureFilter} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
              <div className="aspect-square bg-[#2E2E2E] rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-[#2E2E2E] rounded w-1/3" />
                <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No items found" description="Check back soon for new physical art pieces." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40"
            >
              <div className="relative aspect-square">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{item.artist_name}</p>
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{categoryLabels[item.category]}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#333]">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Price</p>
                    <p className="text-sm font-bold text-[#FDB910]">{item.price_indi} INDI</p>
                  </div>
                  {item.stock_quantity > 0 && (
                    <span className="text-xs text-[#2A5C3E]">In stock</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}