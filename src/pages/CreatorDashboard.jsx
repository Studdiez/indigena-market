import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  PlusCircle, Package, DollarSign, BarChart3, 
  BookOpen, Settings, Headphones, Wifi, WifiOff,
  TrendingUp, Eye, Heart
} from "lucide-react";
import { motion } from "framer-motion";
import StatsCard from "@/components/shared/StatsCard";

export default function CreatorDashboard() {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: artist } = useQuery({
    queryKey: ["current-artist", user?.email],
    queryFn: () => base44.entities.Artist.filter({ created_by: user?.email }, "-created_date", 1).then(res => res[0]),
    enabled: !!user,
  });

  const { data: myNFTs = [] } = useQuery({
    queryKey: ["my-nfts", user?.email],
    queryFn: () => base44.entities.NFT.filter({ created_by: user?.email }, "-created_date", 100),
    enabled: !!user,
  });

  const actions = [
    { icon: PlusCircle, label: "Add New Listing", page: "CreatorAddListing", color: "gradient-red" },
    { icon: Package, label: "My Listings", page: "CreatorListings", color: "bg-[#FDB910]/15" },
    { icon: DollarSign, label: "Earnings & Wallet", page: "CreatorWallet", color: "bg-[#2A5C3E]/15" },
    { icon: BarChart3, label: "My Sales", page: "CreatorSales", color: "bg-purple-500/15" },
    { icon: BookOpen, label: "Courses I Teach", page: "CreatorCourses", color: "bg-blue-500/15" },
    { icon: Headphones, label: "Digital Champion", page: "DigitalChampions", color: "bg-orange-500/15" },
  ];

  const stats = [
    { 
      title: "Total Earnings", 
      value: `${artist?.total_sales_indi?.toLocaleString() || 0} INDI`,
      subtitle: "Lifetime",
      icon: TrendingUp,
      color: "text-[#FDB910]"
    },
    { 
      title: "Active Listings", 
      value: myNFTs.filter(n => n.status === "listed").length,
      subtitle: "Live on market",
      icon: Package,
      color: "text-[#B51D19]"
    },
    { 
      title: "Total Views", 
      value: myNFTs.reduce((sum, n) => sum + (n.views || 0), 0).toLocaleString(),
      subtitle: "All time",
      icon: Eye,
      color: "text-blue-400"
    },
    { 
      title: "SEVA Impact", 
      value: `${artist?.total_seva_donated?.toLocaleString() || 0} INDI`,
      subtitle: "Community funded",
      icon: Heart,
      color: "text-[#2A5C3E]"
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, {artist?.display_name || user?.full_name || "Creator"}
              </h1>
              {artist?.nation && (
                <p className="text-gray-400">{artist.nation} • {artist.tribe}</p>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242424] border border-[#333]">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-500">Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Offline Banner */}
          {!isOnline && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm">
              You are offline. New listings will upload automatically when connected.
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} index={index} />
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={createPageUrl(action.page)}
                  className="block p-6 rounded-2xl bg-[#242424] border border-[#333] hover:border-[#B51D19]/40 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{action.label}</h3>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            to={createPageUrl("CreatorSettings")}
            className="flex items-center justify-between p-4 rounded-xl bg-[#242424] border border-[#333] hover:border-[#B51D19]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-white">Settings & Profile</span>
            </div>
            <span className="text-gray-500 text-sm">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}