import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Compass,
  PlusCircle,
  User,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
  Layers,
  BarChart3,
  Heart,
  Settings,
  Users,
  BookOpen,
  MapPin,
  TreePine,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Discover", page: "Discover", icon: Compass, category: "main" },
  { name: "Digital Art", page: "Discover", icon: Sparkles, category: "marketplace" },
  { name: "Physical Items", page: "PhysicalMarket", icon: Layers, category: "marketplace" },
  { name: "Courses", page: "Courses", icon: BookOpen, category: "marketplace" },
  { name: "Services", page: "Services", icon: User, category: "marketplace" },
  { name: "Tourism", page: "Tourism", icon: MapPin, category: "marketplace" },
  { name: "Language", page: "Language", icon: BookOpen, category: "marketplace" },
  { name: "Land & Food", page: "LandFood", icon: TreePine, category: "marketplace" },
  { name: "Materials", page: "Materials", icon: Settings, category: "marketplace" },
  { name: "Advocacy", page: "Advocacy", icon: Shield, category: "community" },
  { name: "Artists", page: "Artists", icon: Users, category: "main" },
  { name: "Dashboard", page: "ArtistDashboard", icon: BarChart3, category: "main" },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isActive = (page) => currentPageName === page;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#1A1A1A] border-r border-[#333] z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[#333]">
          <Link to={createPageUrl("Discover")} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Indigena</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#FDB910] font-medium">Market</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main */}
          {NAV_ITEMS.filter(i => i.category === "main").map((item) => {
            const Icon = item.icon;
            const active = isActive(item.page);
            return (
              <Link
                key={item.page + item.name}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#B51D19]/15 text-[#B51D19]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-[#B51D19]" : ""}`} />
                {item.name}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
          
          {/* Marketplace */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold">10 Pillars</p>
          </div>
          {NAV_ITEMS.filter(i => i.category === "marketplace").map((item) => {
            const Icon = item.icon;
            const active = isActive(item.page);
            return (
              <Link
                key={item.page + item.name}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#B51D19]/15 text-[#B51D19]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#B51D19]" : ""}`} />
                {item.name}
              </Link>
            );
          })}
          
          {/* Community */}
          {NAV_ITEMS.filter(i => i.category === "community").map((item) => {
            const Icon = item.icon;
            const active = isActive(item.page);
            return (
              <Link
                key={item.page + item.name}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#B51D19]/15 text-[#B51D19]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#B51D19]" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#333]">
          {user ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B51D19] to-[#FDB910] flex items-center justify-center text-xs font-bold">
                {user.full_name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name || "User"}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => base44.auth.logout()}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => base44.auth.redirectToLogin()}
              className="w-full px-4 py-2.5 rounded-xl gradient-red text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1A1A]/95 backdrop-blur-lg border-b border-[#333] z-50 flex items-center justify-between px-4">
        <Link to={createPageUrl("Discover")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">Indigena</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to={createPageUrl("Discover") + "?search=true"} className="p-2 text-gray-400">
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-0 top-16 bg-[#1A1A1A]/98 backdrop-blur-xl z-40 p-6"
          >
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium ${
                      isActive(item.page) ? "bg-[#B51D19]/15 text-[#B51D19]" : "text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-[#333] z-50 flex items-center justify-around px-2 pb-safe">
        {NAV_ITEMS.filter(i => i.category === "main").slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.page);
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? "text-[#B51D19]" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button className="flex flex-col items-center gap-1 px-3 py-2 text-gray-500" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}