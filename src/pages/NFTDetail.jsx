import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { nftApi, biddingApi, transparencyApi } from "@/components/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart, Eye, Shield, Share2, ExternalLink, ArrowLeft,
  Tag, Leaf, CheckCircle, User
} from "lucide-react";
import { motion } from "framer-motion";

const cultureLabels = {
  maori: "Māori", aboriginal: "Aboriginal", pacific_islander: "Pacific Islander", other: "Other",
};
const tkLabels = {
  tk_restricted: "TK Restricted", tk_community: "TK Community", tk_open: "TK Open", none: null,
};

export default function NFTDetail() {
  const params = new URLSearchParams(window.location.search);
  const nftId = params.get("id");
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: nft, isLoading } = useQuery({
    queryKey: ["nft", nftId],
    queryFn: async () => {
      const results = await base44.entities.NFT.filter({ id: nftId });
      return results[0];
    },
    enabled: !!nftId,
  });

  const { data: isWishlisted } = useQuery({
    queryKey: ["wishlist-check", nftId, user?.email],
    queryFn: async () => {
      const items = await base44.entities.WishlistItem.filter({ nft_id: nftId, user_email: user.email });
      return items.length > 0 ? items[0] : null;
    },
    enabled: !!nftId && !!user?.email,
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        await base44.entities.WishlistItem.delete(isWishlisted.id);
      } else {
        await base44.entities.WishlistItem.create({ nft_id: nftId, user_email: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-check", nftId] });
    },
  });

  if (isLoading || !nft) {
    return (
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-[#242424] animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-[#242424] rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-[#242424] rounded animate-pulse" />
            <div className="h-20 w-full bg-[#242424] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <Link
        to={createPageUrl("Discover")}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl overflow-hidden bg-[#242424] border border-[#333]">
            <img src={nft.image_url} alt={nft.title} className="w-full aspect-square object-cover" />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          {/* Artist */}
          <Link
            to={nft.artist_id ? createPageUrl("ArtistProfile") + `?id=${nft.artist_id}` : "#"}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#B51D19] transition-colors"
          >
            <User className="w-4 h-4" />
            {nft.artist_name || "Unknown Artist"}
          </Link>

          <h1 className="text-3xl lg:text-4xl font-bold">{nft.title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {nft.culture && (
              <Badge className="bg-[#B51D19]/15 text-[#E8524E] border border-[#B51D19]/30">
                {cultureLabels[nft.culture]}
              </Badge>
            )}
            {nft.is_sacred && (
              <Badge className="bg-[#FDB910]/15 text-[#FDB910] border border-[#FDB910]/30">
                <Shield className="w-3 h-3 mr-1" /> Sacred
              </Badge>
            )}
            {tkLabels[nft.tk_label] && (
              <Badge variant="outline" className="border-[#333] text-gray-400">
                {tkLabels[nft.tk_label]}
              </Badge>
            )}
            {(nft.cultural_tags || []).map((tag) => (
              <Badge key={tag} variant="outline" className="border-[#333] text-gray-400">
                <Tag className="w-3 h-3 mr-1" />{tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          {nft.description && (
            <p className="text-gray-400 leading-relaxed">{nft.description}</p>
          )}

          {/* Price Card */}
          <div className="rounded-2xl bg-[#242424] border border-[#333] p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Price</p>
                <p className="text-2xl font-bold text-[#FDB910] mt-1">{nft.price_indi?.toLocaleString()} INDI</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Royalty</p>
                <p className="text-2xl font-bold mt-1">{nft.royalty_percent}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">SEVA Impact</p>
                <p className="text-2xl font-bold text-[#2A5C3E] mt-1">{nft.seva_allocation || 0}%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 gradient-red rounded-xl h-12 text-base font-semibold">
                Buy Now
              </Button>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => wishlistMutation.mutate()}
                  className={`border-[#333] rounded-xl h-12 ${isWishlisted ? "text-[#B51D19]" : "text-gray-400"}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              )}
              <Button variant="outline" className="border-[#333] text-gray-400 rounded-xl h-12">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {nft.views || 0} views</span>
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {nft.wishlist_count || 0} wishlisted</span>
            {nft.has_physical && (
              <span className="flex items-center gap-1.5 text-[#FDB910]">
                <CheckCircle className="w-4 h-4" /> Physical twin
              </span>
            )}
          </div>

          {/* SEVA info */}
          {nft.seva_allocation > 0 && (
            <div className="rounded-2xl bg-[#2A5C3E]/10 border border-[#2A5C3E]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-[#2A5C3E]" />
                <p className="text-sm font-semibold text-[#4ADE80]">Cultural Impact</p>
              </div>
              <p className="text-xs text-gray-400">
                {nft.seva_allocation}% of the {nft.royalty_percent}% royalty goes to cultural preservation through SEVA tokens.
                Every purchase directly supports indigenous communities.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}