import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Briefcase, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  cultural_consulting: "Cultural Consulting",
  commissioned_art: "Commissioned Art",
  speaking: "Speaking",
  language_tutoring: "Language Tutoring",
  traditional_skills: "Traditional Skills",
  design: "Design",
  writing: "Writing",
};

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: gigs = [], isLoading } = useQuery({
    queryKey: ["freelance-gigs", categoryFilter],
    queryFn: () => {
      const filter = { availability: { $in: ["available", "limited"] } };
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.FreelanceGig.filter(filter, "-created_date", 50);
    },
  });

  const filtered = gigs.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.title?.toLowerCase().includes(q) || g.provider_name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Services</h1>
        <p className="text-gray-400 mt-3 text-lg">Hire Indigenous experts for consulting, commissions, and more</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white h-11 rounded-xl"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-56 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Services</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse p-6">
              <div className="h-4 bg-[#2E2E2E] rounded w-2/3 mb-4" />
              <div className="h-3 bg-[#2E2E2E] rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No services found" description="Check back for new freelance opportunities." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((gig, i) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] p-6 hover:border-[#B51D19]/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{gig.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{gig.provider_name}</p>
                </div>
                <Badge className={gig.availability === "available" ? "bg-[#2A5C3E]/15 text-[#2A5C3E]" : "bg-yellow-500/15 text-yellow-500"}>
                  {gig.availability}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{gig.description}</p>
              {gig.specializations && gig.specializations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.specializations.slice(0, 3).map(s => (
                    <Badge key={s} variant="outline" className="border-[#333] text-gray-500 text-xs">{s}</Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                <div>
                  <p className="text-xs text-gray-500">{gig.rate_type === "hourly" ? "Hourly Rate" : gig.rate_type === "daily" ? "Daily Rate" : "Project Rate"}</p>
                  <p className="text-xl font-bold text-[#FDB910] flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />{gig.rate_indi} INDI
                  </p>
                </div>
                <Badge variant="outline" className="border-[#333] text-gray-400 text-xs">
                  {categoryLabels[gig.category]}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}