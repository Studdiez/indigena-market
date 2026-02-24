import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers, Heart, Leaf, TreePine, BookOpen, DollarSign, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import StatsCard from "@/components/shared/StatsCard";
import NFTCard from "@/components/shared/NFTCard";
import EmptyState from "@/components/shared/EmptyState";

const CAUSE_COLORS = {
  land_protection: "#2A5C3E",
  language_preservation: "#B51D19",
  artist_support: "#FDB910",
  carbon_offset: "#059669",
  education: "#8B5CF6",
  cultural_heritage: "#EC4899",
};

const CAUSE_LABELS = {
  land_protection: "Land Protection",
  language_preservation: "Language Preservation",
  artist_support: "Artist Support",
  carbon_offset: "Carbon Offset",
  education: "Education",
  cultural_heritage: "Cultural Heritage",
};

export default function CollectorDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: ownedNfts = [] } = useQuery({
    queryKey: ["owned-nfts", user?.email],
    queryFn: () => base44.entities.NFT.filter({ owner_email: user.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["my-wishlist", user?.email],
    queryFn: () => base44.entities.WishlistItem.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  const { data: sevaTransactions = [] } = useQuery({
    queryKey: ["my-seva", user?.email],
    queryFn: () => base44.entities.SEVATransaction.filter({ donor_email: user.email }, "-created_date"),
    enabled: !!user?.email,
  });

  const { data: wishlistedNfts = [] } = useQuery({
    queryKey: ["wishlisted-nft-details", wishlistItems.map(w => w.nft_id).join(",")],
    queryFn: async () => {
      if (wishlistItems.length === 0) return [];
      const allNfts = await base44.entities.NFT.list("-created_date", 100);
      const wishlistNftIds = wishlistItems.map(w => w.nft_id);
      return allNfts.filter(n => wishlistNftIds.includes(n.id));
    },
    enabled: wishlistItems.length > 0,
  });

  const totalSeva = sevaTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const portfolioValue = ownedNfts.reduce((sum, n) => sum + (n.price_indi || 0), 0);

  // Group SEVA by cause
  const sevaByCause = sevaTransactions.reduce((acc, t) => {
    acc[t.cause] = (acc[t.cause] || 0) + (t.amount || 0);
    return acc;
  }, {});

  const pieData = Object.entries(sevaByCause).map(([cause, value]) => ({
    name: CAUSE_LABELS[cause] || cause,
    value,
    color: CAUSE_COLORS[cause] || "#666",
  }));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-xl font-bold mb-4">Sign in to view your portfolio</h2>
        <Button onClick={() => base44.auth.redirectToLogin()} className="gradient-red rounded-xl">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <p className="text-gray-400 mt-1">Your collection and impact</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="NFTs Owned" value={ownedNfts.length} icon={Layers} color="#B51D19" index={0} />
        <StatsCard title="Portfolio Value" value={`${portfolioValue.toLocaleString()} INDI`} icon={DollarSign} color="#FDB910" index={1} />
        <StatsCard title="SEVA Impact" value={totalSeva.toLocaleString()} icon={Leaf} color="#2A5C3E" index={2} />
        <StatsCard title="Wishlisted" value={wishlistItems.length} icon={Heart} color="#EC4899" index={3} />
      </div>

      <Tabs defaultValue="collection" className="space-y-6">
        <TabsList className="bg-[#242424] border border-[#333]">
          <TabsTrigger value="collection" className="data-[state=active]:bg-[#B51D19] data-[state=active]:text-white">Collection</TabsTrigger>
          <TabsTrigger value="wishlist" className="data-[state=active]:bg-[#B51D19] data-[state=active]:text-white">Wishlist</TabsTrigger>
          <TabsTrigger value="impact" className="data-[state=active]:bg-[#B51D19] data-[state=active]:text-white">SEVA Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="collection">
          {ownedNfts.length === 0 ? (
            <EmptyState icon={Layers} title="No NFTs yet" description="Browse the marketplace to start collecting indigenous art." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {ownedNfts.map((nft, i) => (
                <NFTCard key={nft.id} nft={nft} index={i} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          {wishlistedNfts.length === 0 ? (
            <EmptyState icon={Heart} title="Wishlist empty" description="Heart NFTs to save them here." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {wishlistedNfts.map((nft, i) => (
                <NFTCard key={nft.id} nft={nft} index={i} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* SEVA Chart */}
            <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
              <h3 className="text-lg font-semibold mb-4">Impact Distribution</h3>
              {pieData.length === 0 ? (
                <p className="text-gray-500 text-sm">No SEVA contributions yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#242424", border: "1px solid #333", borderRadius: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
              <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-[#2A5C3E]/30">
                  <TreePine className="w-8 h-8 text-[#2A5C3E]" />
                  <div>
                    <p className="font-semibold">Land Protection</p>
                    <p className="text-sm text-gray-400">{sevaByCause.land_protection?.toFixed(0) || 0} SEVA contributed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-[#B51D19]/30">
                  <BookOpen className="w-8 h-8 text-[#B51D19]" />
                  <div>
                    <p className="font-semibold">Language Preservation</p>
                    <p className="text-sm text-gray-400">{sevaByCause.language_preservation?.toFixed(0) || 0} SEVA contributed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-[#FDB910]/30">
                  <DollarSign className="w-8 h-8 text-[#FDB910]" />
                  <div>
                    <p className="font-semibold">Artist Support</p>
                    <p className="text-sm text-gray-400">{sevaByCause.artist_support?.toFixed(0) || 0} SEVA contributed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl bg-[#242424] border border-[#333] p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">SEVA History</h3>
            {sevaTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No SEVA transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {sevaTransactions.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] border border-[#333]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: (CAUSE_COLORS[t.cause] || "#666") + "20" }}>
                        <Leaf className="w-4 h-4" style={{ color: CAUSE_COLORS[t.cause] || "#666" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{CAUSE_LABELS[t.cause] || t.cause}</p>
                        <p className="text-xs text-gray-500">{t.cause_name || t.source}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#2A5C3E]">+{t.amount} SEVA</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}