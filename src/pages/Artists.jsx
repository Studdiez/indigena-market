import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Artist.list("-total_sales_indi").then((data) => {
      setArtists(data);
      setLoading(false);
    });
  }, []);

  const filtered = artists.filter(
    (a) =>
      !search ||
      a.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.tribe?.toLowerCase().includes(search.toLowerCase())
  );

  const tierColors = {
    earth_guardian: "border-amber-800 text-amber-600",
    sky_creator: "border-sky-700 text-sky-400",
    cosmic_wisdom: "border-purple-700 text-purple-400",
    visionary: "border-yellow-500 text-yellow-300",
  };

  return (
    <div className="min-h-screen stone-texture p-6">
      <div className="mb-6">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-1">Artists</h1>
        <p className="text-muted-foreground text-sm">Meet the Indigenous creators of Indígena Market</p>
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search artists or tribes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((artist) => (
            <Link key={artist.id} to={`/artist/${artist.id}`} className="group block">
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all">
                <div className="relative h-28">
                  <img
                    src={artist.cover_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"; }}
                  />
                </div>
                <div className="px-4 pb-4 -mt-6 relative">
                  <img
                    src={artist.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.id}`}
                    alt={artist.display_name}
                    className="w-12 h-12 rounded-full border-2 border-background object-cover"
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.id}`; }}
                  />
                  <div className="mt-1 flex items-center gap-1">
                    <p className="font-semibold text-sm text-foreground truncate">{artist.display_name}</p>
                    {artist.is_verified && <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{artist.tribe || artist.nation}</p>
                  {artist.tier && (
                    <Badge variant="outline" className={`text-xs mt-1 ${tierColors[artist.tier] || ""}`}>
                      {artist.tier.replace(/_/g, " ")}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}