import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DollarSign, Leaf, Layers, TrendingUp, PlusCircle, Eye, Users, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "@/components/shared/StatsCard";
import NFTCard from "@/components/shared/NFTCard";
import EmptyState from "@/components/shared/EmptyState";

export default function ArtistDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: artists = [] } = useQuery({
    queryKey: ["my-artist-profile", user?.email],
    queryFn: () => base44.entities.Artist.filter({ created_by: user.email }),
    enabled: !!user?.email,
  });
  const artist = artists[0];

  const { data: myNfts = [] } = useQuery({
    queryKey: ["my-nfts", artist?.id],
    queryFn: () => base44.entities.NFT.filter({ artist_id: artist.id }, "-created_date"),
    enabled: !!artist?.id,
  });

  const { data: royalties = [] } = useQuery({
    queryKey: ["my-royalties", artist?.id],
    queryFn: () => base44.entities.Royalty.filter({ artist_id: artist.id }, "-created_date", 50),
    enabled: !!artist?.id,
  });

  const totalEarnings = royalties.reduce((sum, r) => sum + (r.amount_indi || 0), 0);
  const totalSeva = royalties.reduce((sum, r) => sum + (r.seva_amount || 0), 0);
  const totalViews = myNfts.reduce((sum, n) => sum + (n.views || 0), 0);

  // Mock chart data
  const chartData = [
    { month: "Oct", earnings: 120 },
    { month: "Nov", earnings: 340 },
    { month: "Dec", earnings: 280 },
    { month: "Jan", earnings: 450 },
    { month: "Feb", earnings: 620 },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-xl font-bold mb-4">Sign in to view your dashboard</h2>
        <Button onClick={() => base44.auth.redirectToLogin()} className="gradient-red rounded-xl">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {artist?.display_name || user.full_name}</p>
        </motion.div>
        <Link to={createPageUrl("Mint")}>
          <Button className="gradient-red rounded-xl">
            <PlusCircle className="w-4 h-4 mr-2" /> Mint NFT
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Earnings" value={`${totalEarnings.toLocaleString()} INDI`} icon={DollarSign} color="#FDB910" index={0} />
        <StatsCard title="SEVA Donated" value={`${totalSeva.toLocaleString()}`} icon={Leaf} color="#2A5C3E" index={1} />
        <StatsCard title="NFTs Created" value={myNfts.length} icon={Layers} color="#B51D19" index={2} />
        <StatsCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} color="#8B5CF6" index={3} />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#242424] border border-[#333] p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FDB910" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FDB910" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: "#242424", border: "1px solid #333", borderRadius: 12 }}
              labelStyle={{ color: "#fff" }}
            />
            <Area type="monotone" dataKey="earnings" stroke="#FDB910" fill="url(#earningsGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Royalties */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Royalties</h2>
          {royalties.length === 0 ? (
            <p className="text-gray-500 text-sm">No royalties yet. Mint and sell NFTs to earn.</p>
          ) : (
            <div className="space-y-3">
              {royalties.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A] border border-[#333]">
                  <div>
                    <p className="text-sm font-medium">{r.sale_type === "primary" ? "Primary Sale" : "Secondary Sale"}</p>
                    <p className="text-xs text-gray-500">{r.royalty_percent}% royalty</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#FDB910]">+{r.amount_indi} INDI</p>
                    {r.seva_amount > 0 && <p className="text-xs text-[#2A5C3E]">+{r.seva_amount} SEVA</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing</h2>
          {myNfts.length === 0 ? (
            <p className="text-gray-500 text-sm">No NFTs yet.</p>
          ) : (
            <div className="space-y-3">
              {myNfts.slice(0, 5).map((nft) => (
                <Link key={nft.id} to={createPageUrl("NFTDetail") + `?id=${nft.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1A] border border-[#333] hover:border-[#B51D19]/30 transition-colors">
                    <img src={nft.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{nft.title}</p>
                      <p className="text-xs text-gray-500">{nft.views || 0} views</p>
                    </div>
                    <p className="text-sm font-bold text-[#FDB910]">{nft.price_indi} INDI</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My NFTs Grid */}
      <h2 className="text-xl font-bold mb-6">My NFTs ({myNfts.length})</h2>
      {myNfts.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No NFTs yet"
          description="Start minting your indigenous art to see them here."
          action={
            <Link to={createPageUrl("Mint")}>
              <Button className="gradient-red rounded-xl">
                <PlusCircle className="w-4 h-4 mr-2" /> Mint First NFT
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {myNfts.map((nft, i) => (
            <NFTCard key={nft.id} nft={nft} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}