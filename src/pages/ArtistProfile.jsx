import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Globe, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import NFTCard from "@/components/shared/NFTCard";
import EmptyState from "@/components/shared/EmptyState";
import { Layers } from "lucide-react";

const tierConfig = {
  earth_guardian: { label: "Earth Guardian", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  sky_creator: { label: "Sky Creator", color: "text-sky-400", bg: "bg-sky-400/10" },
  cosmic_wisdom: { label: "Cosmic Wisdom", color: "text-purple-400", bg: "bg-purple-400/10" },
  visionary: { label: "Visionary", color: "text-[#FDB910]", bg: "bg-[#FDB910]/10" },
};

const cultureLabels = {
  maori: "Māori", aboriginal: "Aboriginal", pacific_islander: "Pacific Islander", other: "Other",
};

export default function ArtistProfile() {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  const { data: artist, isLoading: loadingArtist } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: async () => {
      const results = await base44.entities.Artist.filter({ id: artistId });
      return results[0];
    },
    enabled: !!artistId,
  });

  const { data: nfts = [], isLoading: loadingNfts } = useQuery({
    queryKey: ["artist-nfts", artistId],
    queryFn: () => base44.entities.NFT.filter({ artist_id: artistId, status: "listed" }, "-created_date"),
    enabled: !!artistId,
  });

  if (loadingArtist || !artist) {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="h-48 rounded-2xl bg-[#242424] animate-pulse mb-6" />
        <div className="h-8 w-1/3 bg-[#242424] rounded animate-pulse" />
      </div>
    );
  }

  const tier = tierConfig[artist.tier] || tierConfig.earth_guardian;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cover */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        {artist.cover_url ? (
          <img src={artist.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#B51D19]/40 to-[#FDB910]/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
        <Link
          to={createPageUrl("Artists")}
          className="absolute top-4 left-4 p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="px-6 lg:px-10 -mt-16 relative z-10">
        {/* Avatar & Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-24 h-24 rounded-2xl border-4 border-[#1A1A1A] overflow-hidden bg-[#333] flex-shrink-0">
            {artist.avatar_url ? (
              <img src={artist.avatar_url} alt={artist.display_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-red flex items-center justify-center text-3xl font-bold">
                {artist.display_name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold">{artist.display_name}</h1>
              {artist.is_verified && <CheckCircle className="w-5 h-5 text-[#FDB910]" />}
            </div>
            <p className={`text-sm mt-1 ${tier.color}`}>{tier.label}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-[#B51D19]/15 text-[#E8524E] border border-[#B51D19]/30">
                {cultureLabels[artist.culture] || artist.culture}
              </Badge>
              {artist.tribe && <Badge variant="outline" className="border-[#333] text-gray-400">{artist.tribe}</Badge>}
              {artist.nation && <Badge variant="outline" className="border-[#333] text-gray-400">{artist.nation}</Badge>}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xl font-bold">{nfts.length}</p>
              <p className="text-xs text-gray-500">Works</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#FDB910]">{artist.total_sales_indi?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-500">INDI Earned</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#2A5C3E]">{artist.total_seva_donated?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-500">SEVA Given</p>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        {artist.bio && (
          <p className="text-gray-400 mt-6 max-w-2xl leading-relaxed">{artist.bio}</p>
        )}

        {/* Links */}
        <div className="flex gap-3 mt-4">
          {artist.website && (
            <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* NFTs */}
        <h2 className="text-xl font-bold mt-10 mb-6">Works ({nfts.length})</h2>
        {loadingNfts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#242424] border border-[#333] animate-pulse">
                <div className="aspect-square bg-[#2E2E2E] rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#2E2E2E] rounded w-2/3" />
                  <div className="h-3 bg-[#2E2E2E] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <EmptyState icon={Layers} title="No works yet" description="This artist hasn't minted any NFTs yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {nfts.map((nft, i) => (
              <NFTCard key={nft.id} nft={nft} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}