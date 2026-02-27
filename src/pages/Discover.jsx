import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { nftApi } from "@/components/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Paintbrush, Package, GraduationCap, Handshake, HeartHandshake,
  Mountain, BookOpen, TreePine, Scale, Wrench,
  Home, Search, Heart, User, ChevronRight
} from "lucide-react";

const PILLARS = [
  { icon: Paintbrush,     label: "DIGITAL ARTS",    page: "Discover" },
  { icon: Package,        label: "PHYSICAL ITEMS",  page: "PhysicalMarket" },
  { icon: GraduationCap,  label: "COURSES",         page: "Courses" },
  { icon: Handshake,      label: "FREELANCING",     page: "Services" },
  { icon: HeartHandshake, label: "SEVA GIVING",     page: "SevaHub" },
  { icon: Mountain,       label: "CULTURAL TOURISM",page: "Tourism" },
  { icon: BookOpen,       label: "HERITAGE",        page: "Language" },
  { icon: TreePine,       label: "LAND & FOOD",     page: "LandFood" },
  { icon: Scale,          label: "ADVOCACY",        page: "Advocacy" },
  { icon: Wrench,         label: "MATERIALS",       page: "Materials" },
];

const FEATURED_ARTIST = {
  name: "Aunty Rosie",
  nation: "Arrernte Nation",
  image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  artworkImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80",
  artworkPrice: "$350",
  artworkTitle: "Sacred Dreamtime Weaving",
};

const FEATURED_ARTWORKS = [
  { image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400&q=80", title: "Ochre Songlines", price: "$120" },
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", title: "Woven Ceremony Vessel", price: "$350" },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=300&q=80",
  "https://images.unsplash.com/photo-1571843439991-dd2b8e051966?w=300&q=80",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&q=80",
  "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=300&q=80",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  "https://images.unsplash.com/photo-1565299715199-866c917206bb?w=300&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80",
  "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&q=80",
];

function PillarIcon({ pillar, index }) {
  const Icon = pillar.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <Link to={createPageUrl(pillar.page)}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          style={{
            background: "radial-gradient(circle at 35% 35%, #C42020, #8B0000)",
            boxShadow: "0 4px 16px rgba(181,29,25,0.45), inset 0 1px 1px rgba(255,255,255,0.12)",
          }}
        >
          <Icon className="w-6 h-6" style={{ color: "#FDB910", strokeWidth: 1.5 }} />
        </div>
      </Link>
      <span className="text-[9px] font-semibold tracking-wide text-center leading-tight"
        style={{ color: "#9CA3AF", maxWidth: 60 }}>
        {pillar.label}
      </span>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle, linkPage }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-base font-black tracking-widest uppercase"
          style={{ color: "#B51D19", letterSpacing: "0.18em" }}>
          {title}
        </h2>
        {subtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span style={{ color: "#c8952a", fontSize: 10 }}>—</span>
            <span className="text-xs italic tracking-widest" style={{ background: "linear-gradient(90deg, #c8952a, #f5d67a, #fdb910, #e8a800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{subtitle}</span>
            <span style={{ color: "#c8952a", fontSize: 10 }}>—</span>
          </div>
        )}
      </div>
      {linkPage && (
        <Link to={createPageUrl(linkPage)}>
          <span className="text-xs font-medium" style={{ color: "#6B7280" }}>View All</span>
        </Link>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 my-2 px-5">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #333)" }} />
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 rounded-full" style={{ background: "#FDB910", opacity: 0.5 }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FDB910", opacity: 0.8 }} />
        <div className="w-1 h-1 rounded-full" style={{ background: "#FDB910", opacity: 0.5 }} />
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #333)" }} />
    </div>
  );
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState("home");

  const { data: nfts = [], isLoading } = useQuery({
    queryKey: ["nfts-gallery"],
    queryFn: async () => {
      try {
        const data = await nftApi.getAll();
        let results = Array.isArray(data) ? data : (data.nfts || data.data || []);
        return results.filter(n => n.status === "listed").slice(0, 9);
      } catch {
        return base44.entities.NFT.filter({ status: "listed" }, "-created_date", 9);
      }
    },
  });

  return (
    <div className="min-h-screen pb-24 relative" style={{ maxWidth: 480, margin: "0 auto", background: "#1A1A1A", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")" }}>

      {/* ── HEADER ── */}
      <div className="relative flex flex-col items-center pt-10 pb-6 px-4"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(181,29,25,0.28) 0%, transparent 70%)" }}>

        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699cf7df7e22f660eaef5fef/8b105753d_Addaheading7.png"
            alt="Indigena Market Logo"
            className="w-28 h-28 object-contain drop-shadow-2xl"
          />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl font-black tracking-widest uppercase text-center"
          style={{ color: "#B51D19", fontFamily: "serif", letterSpacing: "0.18em" }}>
          INDIGENA MARKET
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-1">
          <span style={{ color: "#c8952a", fontSize: 11 }}>—</span>
          <span className="text-sm font-semibold tracking-[0.3em] italic" style={{ background: "linear-gradient(90deg, #c8952a, #f5d67a, #fdb910, #e8a800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Marketplace</span>
          <span style={{ color: "#c8952a", fontSize: 11 }}>—</span>
        </motion.div>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-8 h-px" style={{ background: "#FDB910" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FDB910" }} />
          <div className="w-8 h-px" style={{ background: "#FDB910" }} />
        </div>
      </div>

      {/* ── TEN PILLARS ── */}
      <section className="px-5 py-4">
        <SectionHeader title="THE TEN PILLARS" />
        <div className="grid grid-cols-5 gap-3 mt-5">
          {PILLARS.map((p, i) => <PillarIcon key={p.label} pillar={p} index={i} />)}
        </div>
      </section>

      <Divider />

      {/* ── FEATURED ARTIST ── */}
      <section className="px-5 py-4">
        <SectionHeader title="FEATURED ARTIST" subtitle="Artist of the Month" linkPage="Artists" />
        <div className="flex gap-3 mt-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden flex-1" style={{ aspectRatio: "3/4", minHeight: 200 }}>
            <img src={FEATURED_ARTIST.image} alt={FEATURED_ARTIST.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-bold text-lg leading-tight">{FEATURED_ARTIST.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#FDB910" }}>{FEATURED_ARTIST.nation}</p>
              <Link to={createPageUrl("Artists")}>
                <button className="mt-2 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ borderColor: "#FDB910", color: "#FDB910", background: "rgba(0,0,0,0.4)" }}>
                  View Profile
                </button>
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden flex-1" style={{ aspectRatio: "3/4", minHeight: 200 }}>
            <img src={FEATURED_ARTIST.artworkImage} alt={FEATURED_ARTIST.artworkTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }} />
            <div className="absolute bottom-3 right-3">
              <span className="px-3 py-1 rounded-full text-sm font-bold"
                style={{ background: "rgba(181,29,25,0.9)", color: "#FDB910" }}>
                {FEATURED_ARTIST.artworkPrice}
              </span>
            </div>
            <div className="absolute bottom-10 left-3 right-3">
              <p className="text-white text-xs leading-snug">{FEATURED_ARTIST.artworkTitle}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── FEATURED ARTWORK ── */}
      <section className="px-5 py-4">
        <SectionHeader title="FEATURED ARTWORK" subtitle="Curated for you" linkPage="Discover" />
        <div className="flex gap-3 mt-4">
          {FEATURED_ARTWORKS.map((art, i) => (
            <motion.div key={art.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="relative rounded-xl overflow-hidden flex-1" style={{ aspectRatio: "1/1" }}>
              <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                <p className="text-white text-xs font-medium leading-tight max-w-[60%]">{art.title}</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(181,29,25,0.9)", color: "#FDB910" }}>
                  {art.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section className="px-5 py-4">
        <SectionHeader title="GALLERY" subtitle="Browse all" linkPage="Discover" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          {isLoading
            ? Array(9).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl animate-pulse" style={{ aspectRatio: "1/1", background: "#242424" }} />
              ))
            : (nfts.length > 0 ? nfts : GALLERY_IMAGES).map((item, i) => {
                const imgUrl = typeof item === "string" ? item : item.image_url;
                const price = typeof item === "string" ? null : item.price_indi;
                return (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img src={imgUrl || GALLERY_IMAGES[i % GALLERY_IMAGES.length]} alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = GALLERY_IMAGES[i % GALLERY_IMAGES.length]; }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
                    {price && (
                      <div className="absolute bottom-1.5 right-1.5">
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                          style={{ background: "rgba(181,29,25,0.9)", color: "#FDB910" }}>
                          {price} INDI
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
        </div>
        <Link to={createPageUrl("Discover")}>
          <motion.button whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3 rounded-full text-sm font-semibold border flex items-center justify-center gap-2"
            style={{ borderColor: "#FDB910", color: "#FDB910", background: "transparent" }}>
            View All <ChevronRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </section>


    </div>
  );
}