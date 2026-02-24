import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const tierConfig = {
  earth_guardian: { label: "Earth Guardian", color: "text-emerald-400" },
  sky_creator: { label: "Sky Creator", color: "text-sky-400" },
  cosmic_wisdom: { label: "Cosmic Wisdom", color: "text-purple-400" },
  visionary: { label: "Visionary", color: "text-[#FDB910]" },
};

const cultureLabels = {
  maori: "Māori",
  aboriginal: "Aboriginal",
  pacific_islander: "Pacific Islander",
  other: "Other",
};

export default function ArtistCard({ artist, index = 0 }) {
  const tier = tierConfig[artist.tier] || tierConfig.earth_guardian;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={createPageUrl("ArtistProfile") + `?id=${artist.id}`}>
        <div className="nft-card group rounded-2xl overflow-hidden bg-[#242424] border border-[#333] hover:border-[#B51D19]/40">
          {/* Cover */}
          <div className="h-28 relative overflow-hidden">
            {artist.cover_url ? (
              <img src={artist.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#B51D19]/30 to-[#FDB910]/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#242424] via-transparent to-transparent" />
          </div>

          {/* Avatar */}
          <div className="px-4 -mt-10 relative z-10">
            <div className="w-16 h-16 rounded-2xl border-4 border-[#242424] overflow-hidden bg-[#333]">
              {artist.avatar_url ? (
                <img src={artist.avatar_url} alt={artist.display_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-red flex items-center justify-center text-xl font-bold">
                  {artist.display_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 pt-2">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm truncate">{artist.display_name}</h3>
              {artist.is_verified && <CheckCircle className="w-3.5 h-3.5 text-[#FDB910] flex-shrink-0" />}
            </div>
            <p className={`text-xs mt-0.5 ${tier.color}`}>{tier.label}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-[10px] border-[#333] text-gray-400">
                {cultureLabels[artist.culture] || artist.culture}
              </Badge>
              {artist.tribe && (
                <Badge variant="outline" className="text-[10px] border-[#333] text-gray-400">
                  {artist.tribe}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#333] text-xs text-gray-500">
              <span>{artist.total_sales_indi?.toLocaleString() || 0} INDI earned</span>
              <span className="text-[#2A5C3E]">{artist.total_seva_donated?.toLocaleString() || 0} SEVA</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}