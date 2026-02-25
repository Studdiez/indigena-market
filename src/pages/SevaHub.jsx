import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, TrendingUp, Users, School, TreePine, Building, Droplet, Globe, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const categoryIcons = {
  schools: School,
  land_back: TreePine,
  business_hubs: Building,
  water: Droplet,
  culture: Globe,
  emergency: AlertCircle,
};

const categoryColors = {
  schools: "bg-blue-500/15 text-blue-400",
  land_back: "bg-green-500/15 text-green-400",
  business_hubs: "bg-purple-500/15 text-purple-400",
  water: "bg-cyan-500/15 text-cyan-400",
  culture: "bg-orange-500/15 text-orange-400",
  emergency: "bg-red-500/15 text-red-400",
};

export default function SevaHub() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["seva-projects", categoryFilter],
    queryFn: () => {
      const filter = { status: "active" };
      if (categoryFilter !== "all") filter.category = categoryFilter;
      return base44.entities.SEVAProject.filter(filter, "-created_date", 50);
    },
  });

  const totalRaised = projects.reduce((sum, p) => sum + (p.raised_amount || 0), 0);
  const totalGoal = projects.reduce((sum, p) => sum + (p.goal_amount || 0), 0);
  const totalDonors = projects.reduce((sum, p) => sum + (p.donors_count || 0), 0);
  const communitiesServed = new Set(projects.map(p => p.community_name)).size;

  const featuredProject = projects.find(p => p.is_featured) || projects[0];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B51D19]/20 to-[#1A1A1A]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <Heart className="w-16 h-16 text-[#B51D19] mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Together, We Build
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every purchase, every donation, every action creates lasting change for Indigenous communities
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-[#242424] border border-[#333]"
          >
            <TrendingUp className="w-8 h-8 text-[#FDB910] mb-3" />
            <p className="text-3xl font-bold text-white">${totalRaised.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Raised</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-[#242424] border border-[#333]"
          >
            <Globe className="w-8 h-8 text-[#B51D19] mb-3" />
            <p className="text-3xl font-bold text-white">{communitiesServed}</p>
            <p className="text-sm text-gray-500">Communities Served</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-[#242424] border border-[#333]"
          >
            <Building className="w-8 h-8 text-[#2A5C3E] mb-3" />
            <p className="text-3xl font-bold text-white">{projects.length}</p>
            <p className="text-sm text-gray-500">Active Projects</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-[#242424] border border-[#333]"
          >
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-3xl font-bold text-white">{totalDonors.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Donors</p>
          </motion.div>
        </div>

        {/* Featured Project */}
        {featuredProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Featured Project</h2>
            <Link to={createPageUrl("SevaProject") + `?id=${featuredProject.id}`}>
              <div className="nft-card rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40">
                {featuredProject.cover_url && (
                  <div className="h-64 overflow-hidden">
                    <img src={featuredProject.cover_url} alt={featuredProject.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <Badge className={categoryColors[featuredProject.category]}>
                    {featuredProject.category.replace(/_/g, " ")}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mt-3">{featuredProject.title}</h3>
                  <p className="text-gray-400 mt-2 line-clamp-2">{featuredProject.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{featuredProject.community_name}</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-semibold text-white">
                        ${featuredProject.raised_amount.toLocaleString()} / ${featuredProject.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(featuredProject.raised_amount / featuredProject.goal_amount) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{Math.round((featuredProject.raised_amount / featuredProject.goal_amount) * 100)}% funded</span>
                      <span>{featuredProject.donors_count} donors</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              categoryFilter === "all" 
                ? "gradient-red text-white" 
                : "bg-[#242424] text-gray-400 hover:text-white"
            }`}
          >
            All Projects
          </button>
          {Object.keys(categoryIcons).map(cat => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat 
                    ? "gradient-red text-white" 
                    : "bg-[#242424] text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Heart} 
            title="No projects found" 
            description="Check back soon for new community projects." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => !p.is_featured || categoryFilter !== "all").map((project, i) => {
              const Icon = categoryIcons[project.category];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={createPageUrl("SevaProject") + `?id=${project.id}`}>
                    <div className="nft-card h-full rounded-2xl bg-[#242424] border border-[#333] overflow-hidden hover:border-[#B51D19]/40">
                      {project.cover_url && (
                        <div className="h-48 overflow-hidden">
                          <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <Badge className={`${categoryColors[project.category]} text-xs`}>
                            {project.category.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{project.community_name}</p>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description}</p>
                        
                        <div className="space-y-2">
                          <Progress 
                            value={(project.raised_amount / project.goal_amount) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">
                              ${project.raised_amount.toLocaleString()} raised
                            </span>
                            <span className="font-semibold text-white">
                              {Math.round((project.raised_amount / project.goal_amount) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}