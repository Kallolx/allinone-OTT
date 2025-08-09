import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllBanglaContent, type MovieDetails } from "@/lib/tmdb";
import { getRandomOtherPlatformUrl } from "@/lib/platformUrls";

export function MostPlayedSection() {
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const banglaContent = await getAllBanglaContent();
      setMovies(banglaContent);
      setIsLoading(false);
    };
    fetchMovies();
  }, []);


  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-foreground">🔥Bengali Shows</h2>
        </div>
        <button
          className="text-primary md:text-lg hover:text-primary/80 transition-colors text-xs font-medium"
          onClick={() => navigate('/dashboard/movies')}
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="group cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card border-border overflow-hidden"
            onClick={() => {
              const randomUrl = getRandomOtherPlatformUrl();
              window.open(randomUrl, "_blank");
            }}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-background/80 text-foreground text-xs flex items-center gap-1"
                  >
                    ⭐ {movie.rating.toFixed(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                  <Badge
                    variant="outline"
                    className="bg-secondary text-white text-xs"
                  >
                    {movie.popularity.toLocaleString()}+ views
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-background/80 text-foreground text-xs"
                  >
                    {movie.voteCount.toLocaleString()} votes
                  </Badge>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    {movie.year} • {movie.genres.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
