import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle } from "lucide-react";

export default function Champions() {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.DigitalChampion.filter({ availability: "available" }).then((data) => {
      setChampions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen stone-texture p-6">
      <div className="mb-6">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-1">Digital Champions</h1>
        <p className="text-muted-foreground text-sm">Local helpers who assist Indigenous artists with technology, uploads, and onboarding</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : champions.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No champions available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {champions.map((c) => (
            <Card key={c.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex gap-4">
                <img
                  src={c.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`; }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                    {c.is_verified && <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {c.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{c.artists_helped} artists helped</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.services?.slice(0, 3).map((s) => (
                      <Badge key={s} variant="outline" className="text-xs border-border px-1">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}