import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Users, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  lodging: "Lodging",
  guided_tour: "Guided Tour",
  cultural_experience: "Cultural Experience",
  virtual_event: "Virtual Event",
  festival: "Festival",
};

export default function Tourism() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["tourism", categoryFilter],
    queryFn: () => {
      const filter = {};
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.TourismExperience.filter(filter, "-created_date", 50);
    },
  });

  const filtered = experiences.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Cultural Tourism</h1>
        <p className="text-gray-400 mt-3 text-lg">Book authentic experiences with Indigenous communities</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search experiences..."
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
              <SelectItem value="all" className="text-white">All Experiences</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
              <div className="h-48 bg-[#2E2E2E] rounded-t-2xl" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
                <div className="h-3 bg-[#2E2E2E] rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={MapPin} title="No experiences found" description="New tourism offerings coming soon." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40"
            >
              {exp.cover_url && (
                <div className="h-48 overflow-hidden">
                  <img src={exp.cover_url} alt={exp.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <Badge className="mb-3 bg-[#B51D19]/15 text-[#E8524E] border-[#B51D19]/30 text-xs">
                  {categoryLabels[exp.category]}
                </Badge>
                <h3 className="font-semibold text-lg mb-1">{exp.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{exp.host_name}</p>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{exp.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>
                  {exp.duration && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</span>}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                  <p className="text-xl font-bold text-[#FDB910]">{exp.price_indi} INDI</p>
                  {exp.max_participants && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Max {exp.max_participants}
                    </span>
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