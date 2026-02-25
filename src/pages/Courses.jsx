import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, Clock, Users, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryLabels = {
  art_craft: "Art & Craft",
  language: "Language",
  traditional_skills: "Traditional Skills",
  storytelling: "Storytelling",
  plant_medicine: "Plant Medicine",
  cultural_practices: "Cultural Practices",
};

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", categoryFilter],
    queryFn: () => {
      const filter = { status: "published" };
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.Course.filter(filter, "-created_date", 50);
    },
  });

  const filtered = courses.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title?.toLowerCase().includes(q) || c.instructor_name?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Courses</h1>
        <p className="text-gray-400 mt-3 text-lg">Learn from Indigenous knowledge keepers and master artists</p>
      </motion.div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search courses..."
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
              <SelectItem value="all" className="text-white">All Categories</SelectItem>
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
              <div className="h-3 bg-[#2E2E2E] rounded w-full mb-2" />
              <div className="h-3 bg-[#2E2E2E] rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="New courses are added regularly." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40"
            >
              {course.cover_url && (
                <div className="h-48 overflow-hidden">
                  <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{course.instructor_name}</p>
                  </div>
                  <Badge className="bg-[#FDB910]/15 text-[#FDB910] border-[#FDB910]/30">
                    {course.level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_hours}h</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count} enrolled</span>
                  {course.certificate_offered && (
                    <span className="flex items-center gap-1 text-[#2A5C3E]"><Award className="w-3 h-3" /> Certificate</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                  <p className="text-xl font-bold text-[#FDB910]">{course.price_indi} INDI</p>
                  <Badge variant="outline" className="border-[#333] text-gray-400 text-xs">
                    {categoryLabels[course.category]}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}