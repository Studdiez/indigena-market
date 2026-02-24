import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Eye, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const cultureColors = {
  maori: "bg-[#B51D19]/20 text-[#E8524E] border-[#B51D19]/30",
  aboriginal: "bg-[#FDB910]/20 text-[#FDB910] border-[#FDB910]/30",
  pacific_islander: "bg-[#2A5C3E]/20 text-[#4ADE80] border-[#2A5C3E]/30",
  other: "bg-white/10 text-gray-300 border-white/10",
};

const cultureLabels = {
  maori: "Māori",
  aboriginal: "Aboriginal",
  pacific_islander: "Pacific Islander",
  other: "Other",
};

export default function NFTCard({ nft, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={createPageUrl("NFTDetail") + `?id=${nft.id}`}>
        <div className="nft-card group rounded-2xl overflow-hidden bg-[#242424] border border-[#333] hover:border-[#B51D19]/40">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={nft.image_url}
              alt={nft.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {nft.is_sacred && (
                <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Shield className="w-3.5 h-3.5 text-[#FDB910]" />
                </div>
              )}
              {nft.culture && (
                <Badge className={`text-[10px] border ${cultureColors[nft.culture]} backdrop-blur-sm`}>
                  {cultureLabels[nft.culture]}
                </Badge>
              )}
            </div>

            {/* Bottom stats */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-gray-300">
                <Eye className="w-3 h-3" />
                {nft.views || 0}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-gray-300">
                <Heart className="w-3 h-3" />
                {nft.wishlist_count || 0}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-1">{nft.artist_name || "Unknown Artist"}</p>
            <h3 className="font-semibold text-sm text-white truncate">{nft.title}</h3>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#333]">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
                <p className="text-sm font-bold text-[#FDB910]">{nft.price_indi?.toLocaleString()} INDI</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Royalty</p>
                <p className="text-sm font-medium text-[#2A5C3E]">{nft.royalty_percent}%</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}