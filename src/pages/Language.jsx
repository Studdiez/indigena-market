import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tantml:query";
import { Search, BookOpen, Download, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const resourceTypeLabels = {
  dictionary: "Dictionary",
  learning_tool: "Learning Tool",
  audio_archive: "Audio Archive",
  story: "Story",
  song: "Song",
  translation_service: "Translation Service",
};

export default function Language() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["language-resources", typeFilter],
    queryFn: () => {
      const filter = {};
      if (typeFilter !== "all") filter.resource_type = typeFilter;
      return base44.entities.LanguageResource.filter(filter, "-created_date", 50);
    },
  });

  const filtered = resources.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.title?.toLowerCase().includes(q) || r.language?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Language & Heritage</h1>
        <p className="text-gray-400 mt-3 text-lg">Preserve and learn Indigenous languages</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#242424] border-[#333] text-white h-11 rounded-xl"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-52 bg-[#242424] border-[#333] text-white h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white">All Resources</SelectItem>
              {Object.entries(resourceTypeLabels).map(([key, label]) => (
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
        <EmptyState icon={BookOpen} title="No resources found" description="Language preservation resources coming soon." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] p-6 hover:border-[#B51D19]/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <p className="text-sm text-[#FDB910] mt-1">{resource.language}</p>
                </div>
                {resource.is_elder_approved && (
                  <Badge className="bg-[#2A5C3E]/15 text-[#2A5C3E] border-[#2A5C3E]/30">Elder Approved</Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-[#333] text-gray-400 text-xs">
                  {resourceTypeLabels[resource.resource_type]}
                </Badge>
                {resource.audio_url && (
                  <Badge variant="outline" className="border-[#333] text-gray-400 text-xs flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Audio
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                {resource.access_type === "free" ? (
                  <p className="text-lg font-bold text-[#2A5C3E]">Free</p>
                ) : (
                  <p className="text-lg font-bold text-[#FDB910]">{resource.price_indi} INDI</p>
                )}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Download className="w-3 h-3" /> {resource.downloads_count || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}