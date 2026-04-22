import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen stone-texture">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-primary font-cinzel text-sm tracking-widest uppercase mb-4">Welcome to</p>
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-4">
            <span className="gold-gradient">Indígena</span>
            <br />
            <span className="text-foreground">Market</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            The world's first Indigenous-owned NFT marketplace — preserving culture, protecting sovereignty, powering community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button className="gold-gradient-bg text-black font-bold px-8 py-3 text-base hover:opacity-90">
                Explore Art <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/seva">
              <Button variant="outline" className="border-primary text-primary px-8 py-3 text-base hover:bg-primary/10">
                Support SEVA
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-16 max-w-5xl mx-auto">
        {[
          { icon: Shield, title: "Sovereignty First", desc: "Every sale enforces Traditional Knowledge labels and cultural protocols." },
          { icon: Leaf, title: "SEVA Impact", desc: "A portion of every transaction funds land protection, language revival, and community projects." },
          { icon: Globe, title: "Global Indigenous Market", desc: "Maori, Aboriginal, Pacific Islander artists and beyond — one unified platform." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
            <Icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-cinzel font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}