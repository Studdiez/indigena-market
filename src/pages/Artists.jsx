import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import ArtistCard from "@/components/shared/ArtistCard";
import CultureFilter from "@/components/shared/CultureFilter";
import EmptyState from "@/components/shared/EmptyState";
import { motion } from "framer-motion";

export default function Artists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cultureFilter, setCultureFilter] = useState("all");

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ["artists", cultureFilter],
    queryFn: () => {
      const filter = {};
      if (cultureFilter !== "all") filter.culture = cultureFilter;
      return base44.entities.Artist.filter(filter, "-created_date", 50);
    },
  });

  const filtered = artists.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.display_name?.toLowerCase().includes(q) ||
      a.tribe?.toLowerCase().includes(q) ||
      a.nation?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Artists</h1>
        <p className="text-gray-400 mb-8">Indigenous creators preserving culture through digital art</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#242424] border-[#333] text-white placeholder:text-gray-600 h-11 rounded-xl"
          />
        </div>
        <CultureFilter value={cultureFilter} onChange={setCultureFilter} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
              <div className="h-28 bg-[#2E2E2E] rounded-t-2xl" />
              <div className="p-4 space-y-3 pt-10">
                <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
                <div className="h-3 bg-[#2E2E2E] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No artists found" description="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}