import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, TreePine, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  seeds: "Seeds",
  plants: "Plants",
  dried_foods: "Dried Foods",
  preserves: "Preserves",
  teas: "Teas",
  natural_materials: "Natural Materials",
  medicinal: "Medicinal",
};

export default function LandFood() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["food-products", categoryFilter],
    queryFn: () => {
      const filter = {};
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.FoodProduct.filter(filter, "-created_date", 50);
    },
  });

  const filtered = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.producer_name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Land & Food</h1>
        <p className="text-gray-400 mt-3 text-lg">Indigenous seeds, foods, and natural materials that fund land stewardship</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white h-11 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Products</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
              <div className="aspect-square bg-[#2E2E2E] rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
                <div className="h-3 bg-[#2E2E2E] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={TreePine} title="No products found" description="New land & food products coming soon." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40"
            >
              {product.image_url && (
                <div className="relative aspect-square">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  {product.is_organic && (
                    <Badge className="absolute top-3 right-3 bg-[#2A5C3E]/90 text-white border-none">Organic</Badge>
                  )}
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.producer_name}</p>
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{categoryLabels[product.category]}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-[#2A5C3E]">
                  <Leaf className="w-3 h-3" />
                  <span>{product.land_stewardship_percentage}% to land conservation</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#333]">
                  <p className="text-sm font-bold text-[#FDB910]">{product.price_indi} INDI</p>
                  {product.stock_quantity > 0 && (
                    <span className="text-xs text-gray-500">{product.stock_quantity} left</span>
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