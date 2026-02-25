import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  beads: "Beads",
  canvas: "Canvas",
  dyes: "Dyes",
  clays: "Clays",
  weaving_materials: "Weaving Materials",
  carving_wood: "Carving Wood",
  tools: "Tools",
  equipment: "Equipment",
};

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials", categoryFilter],
    queryFn: () => {
      const filter = {};
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.Material.filter(filter, "-created_date", 50);
    },
  });

  const filtered = materials.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.name?.toLowerCase().includes(q) || m.supplier_name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Materials & Tools</h1>
        <p className="text-gray-400 mt-3 text-lg">Ethical supplies for Indigenous artists and makers</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white h-11 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-52 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Materials</SelectItem>
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
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse p-4">
              <div className="h-32 bg-[#2E2E2E] rounded-xl mb-3" />
              <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No materials found" description="New supplies coming soon." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((material, i) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] p-4 hover:border-[#B51D19]/40"
            >
              {material.image_url && (
                <div className="h-32 rounded-xl overflow-hidden mb-3">
                  <img src={material.image_url} alt={material.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm truncate">{material.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{material.supplier_name}</p>
                </div>
                {material.is_indigenous_sourced && (
                  <CheckCircle className="w-4 h-4 text-[#2A5C3E] flex-shrink-0 ml-2" />
                )}
              </div>
              <Badge variant="outline" className="border-[#333] text-gray-500 text-xs mb-3">
                {categoryLabels[material.category]}
              </Badge>
              <div className="flex items-center justify-between pt-3 border-t border-[#333]">
                <div>
                  <p className="text-sm font-bold text-[#FDB910]">{material.price_indi} INDI</p>
                  <p className="text-xs text-gray-600">{material.unit}</p>
                </div>
                {material.stock_quantity > 0 && (
                  <span className="text-xs text-gray-500">{material.stock_quantity} in stock</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}