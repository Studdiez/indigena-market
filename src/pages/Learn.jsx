import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users } from "lucide-react";

export default function Learn() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Course.filter({ status: "published" }).then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen stone-texture p-6">
      <div className="mb-6">
        <h1 className="font-cinzel text-3xl font-bold gold-gradient mb-1">Learn</h1>
        <p className="text-muted-foreground text-sm">Courses in traditional skills, language, and cultural practices</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-56 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No courses published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
              {course.cover_url && (
                <img src={course.cover_url} alt={course.title} className="w-full h-40 object-cover" />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-cinzel">{course.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{course.instructor_name}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  {course.duration_hours && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_hours}h</span>
                  )}
                  {course.enrolled_count > 0 && (
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.enrolled_count}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">{course.price_indi?.toLocaleString()} INDI</span>
                  <Badge variant="outline" className="text-xs border-border capitalize">{course.level}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}