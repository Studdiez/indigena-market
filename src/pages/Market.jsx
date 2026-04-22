import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Market() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.PhysicalItem.filter({ status: "available" }).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen stone-texture p-6">
      <div className="mb-6">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-1">Market</h1>
        <p className="text-muted-foreground text-sm">Physical Indigenous art, wearables, and cultural goods</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No items listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full aspect-square object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400"; }}
              />
              <CardContent className="p-3">
                <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.artist_name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold text-sm">{item.price_indi?.toLocaleString()} INDI</span>
                  <Badge variant="outline" className="text-xs border-border capitalize">
                    {item.category?.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}