import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Leaf, TreePine, BookOpen, Droplets, Music, AlertTriangle } from "lucide-react";

const CATEGORY_ICONS = {
  schools: BookOpen,
  land_back: TreePine,
  business_hubs: Leaf,
  water: Droplets,
  culture: Music,
  emergency: AlertTriangle,
};

export default function SEVA() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.SEVAProject.filter({ status: "active" }, "-is_featured").then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen stone-texture p-6">
      <div className="mb-8 text-center">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-2">SEVA Projects</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          Every purchase on Indígena Market funds these community-led projects. SEVA means service — to land, language, and people.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const Icon = CATEGORY_ICONS[project.category] || Leaf;
            const pct = project.goal_amount > 0 ? Math.min(100, (project.raised_amount / project.goal_amount) * 100) : 0;
            return (
              <Card key={project.id} className="bg-card border-border hover:border-primary/40 transition-colors overflow-hidden">
                {project.cover_url && (
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-cinzel text-foreground leading-tight">{project.title}</CardTitle>
                    <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground">{project.community_name} · {project.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                  <Progress value={pct} className="h-1.5 mb-1" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${project.raised_amount?.toLocaleString()} raised</span>
                    <span>Goal: ${project.goal_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs border-border capitalize">{project.category?.replace(/_/g, " ")}</Badge>
                    <span className="text-xs text-muted-foreground">{project.donors_count} donors</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}