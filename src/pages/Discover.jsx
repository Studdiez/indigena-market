import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CULTURES = ["All", "Maori", "Aboriginal", "Pacific Islander", "Other"];
const SORT_OPTIONS = ["Latest", "Price: Low to High", "Price: High to Low", "Most Viewed"];

export default function Discover() {
  const [nfts, setNfts] = useState([]);
  const [search, setSearch] = useState("");
  const [culture, setCulture] = useState("All");
  const [sort, setSort] = useState("Latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NFT.filter({ status: "listed" }).then((data) => {
      setNfts(data);
      setLoading(false);
    });
  }, []);

  const filtered = nfts
    .filter((n) => {
      const matchesSearch =
        !search ||
        n.title?.toLowerCase().includes(search.toLowerCase()) ||
        n.artist_name?.toLowerCase().includes(search.toLowerCase());
      const matchesCulture =
        culture === "All" || n.culture === culture.toLowerCase().replace(/ /g, "_");
      return matchesSearch && matchesCulture;
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return (a.price_indi || 0) - (b.price_indi || 0);
      if (sort === "Price: High to Low") return (b.price_indi || 0) - (a.price_indi || 0);
      if (sort === "Most Viewed") return (b.views || 0) - (a.views || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  return (
    <div className="min-h-screen stone-texture">
      {/* Header */}
      <div className="border-b border-border px-6 py-8">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-1">Discover</h1>
        <p className="text-muted-foreground text-sm">Explore authentic Indigenous art from around the world</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks or artists…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map((s) => (
              <Button
                key={s}
                variant={sort === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSort(s)}
                className={sort === s ? "gold-gradient-bg text-black font-semibold" : "border-border text-muted-foreground"}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Culture filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {CULTURES.map((c) => (
            <Badge
              key={c}
              variant={culture === c ? "default" : "outline"}
              className={`cursor-pointer ${culture === c ? "gold-gradient-bg text-black" : "border-border text-muted-foreground hover:border-primary"}`}
              onClick={() => setCulture(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">No artworks found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NFTCard({ nft }) {
  return (
    <Link to={`/nft/${nft.id}`} className="group block">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={nft.image_url}
            alt={nft.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400"; }}
          />
          {nft.is_sacred && (
            <Badge className="absolute top-2 left-2 bg-red-900/80 text-red-200 text-xs">Sacred</Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-black/60 p-1.5 rounded-full text-white hover:text-red-400">
              <Heart className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm truncate text-foreground">{nft.title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{nft.artist_name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-primary font-bold text-sm">{nft.price_indi?.toLocaleString()} INDI</span>
            {nft.seva_allocation > 0 && (
              <Badge variant="outline" className="text-xs border-green-700 text-green-400 px-1">
                {nft.seva_allocation}% SEVA
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}