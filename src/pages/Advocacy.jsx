import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, TrendingUp, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import EmptyState from "@/components/shared/EmptyState";

const caseTypeLabels = {
  cultural_appropriation: "Cultural Appropriation",
  ip_theft: "IP Theft",
  land_rights: "Land Rights",
  treaty_violation: "Treaty Violation",
  policy_advocacy: "Policy Advocacy",
};

const statusColors = {
  open: "bg-blue-500/15 text-blue-400",
  fundraising: "bg-yellow-500/15 text-yellow-400",
  in_progress: "bg-purple-500/15 text-purple-400",
  resolved: "bg-green-500/15 text-green-400",
  closed: "bg-gray-500/15 text-gray-400",
};

export default function Advocacy() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["legal-cases"],
    queryFn: () => base44.entities.LegalCase.filter({}, "-created_date", 50),
  });

  const filtered = cases.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title?.toLowerCase().includes(q) || c.affected_community?.toLowerCase().includes(q);
  });

  const totalFundingGoal = cases.reduce((sum, c) => sum + (c.funding_goal || 0), 0);
  const totalFundingRaised = cases.reduce((sum, c) => sum + (c.funding_raised || 0), 0);
  const totalSupporters = cases.reduce((sum, c) => sum + (c.supporters_count || 0), 0);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl lg:text-5xl font-bold">Advocacy & Legal</h1>
        <p className="text-gray-400 mt-3 text-lg">Collective power to protect Indigenous rights and culture</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FDB910]/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#FDB910]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalFundingRaised.toLocaleString()} INDI</p>
              <p className="text-xs text-gray-500">Raised</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2A5C3E]/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#2A5C3E]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{cases.length}</p>
              <p className="text-xs text-gray-500">Active Cases</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#B51D19]/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#B51D19]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSupporters.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Supporters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#242424] border-[#333] text-white h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Cases */}
      {isLoading ? (
        <div className="space-y-5">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse p-6">
              <div className="h-5 bg-[#2E2E2E] rounded w-1/2 mb-4" />
              <div className="h-3 bg-[#2E2E2E] rounded w-full mb-2" />
              <div className="h-3 bg-[#2E2E2E] rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Shield} title="No cases found" description="No active legal cases at this time." />
      ) : (
        <div className="space-y-5">
          {filtered.map((legalCase, i) => (
            <motion.div
              key={legalCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nft-card rounded-2xl bg-[#242424] border border-[#333] p-6 hover:border-[#B51D19]/40"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{legalCase.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{legalCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusColors[legalCase.status]}>
                      {legalCase.status?.replace(/_/g, " ")}
                    </Badge>
                    <Badge variant="outline" className="border-[#333] text-gray-400 text-xs">
                      {caseTypeLabels[legalCase.case_type]}
                    </Badge>
                    <Badge variant="outline" className="border-[#333] text-gray-400 text-xs">
                      {legalCase.affected_community}
                    </Badge>
                  </div>
                </div>
              </div>

              {legalCase.funding_goal > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="font-semibold">
                      {legalCase.funding_raised.toLocaleString()} / {legalCase.funding_goal.toLocaleString()} INDI
                    </span>
                  </div>
                  <Progress value={(legalCase.funding_raised / legalCase.funding_goal) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{Math.round((legalCase.funding_raised / legalCase.funding_goal) * 100)}% funded</span>
                    <span>{legalCase.supporters_count || 0} supporters</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}