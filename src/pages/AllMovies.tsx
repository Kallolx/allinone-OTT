import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllBanglaContent,
  getIndianContent,
  type MovieDetails,
} from "@/lib/tmdb";
import { getRandomOtherPlatformUrl } from "@/lib/platformUrls";
import { Loader2 } from "lucide-react";

interface MovieGridProps {
  movies: MovieDetails[];
  emptyMessage?: string;
}

function MovieGrid({ movies, emptyMessage = "No content found" }: MovieGridProps) {
  if (!movies?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <Card
          key={movie.id}
          className="group cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card border-border overflow-hidden"
          onClick={() => window.open(getRandomOtherPlatformUrl(), "_blank")}
        >
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
                loading="lazy"
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
                {movie.language && (
                  <Badge variant="outline" className="bg-primary text-white text-xs">
                    {movie.language === 'bn' ? 'Bengali' : movie.language === 'hi' ? 'Hindi' : movie.language}
                  </Badge>
                )}
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
              <div className="flex flex-wrap gap-1">
                <p className="text-muted-foreground text-xs">
                  {movie.year}
                </p>
                {movie.genres.length > 0 && (
                  <>
                    <span className="text-muted-foreground text-xs">•</span>
                    <p className="text-muted-foreground text-xs">
                      {movie.genres.join(", ")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AllMovies() {
  const [bengaliContent, setBengaliContent] = useState<MovieDetails[]>([]);
  const [indianContent, setIndianContent] = useState<MovieDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setIsLoading(true);
        const [bengali, indian] = await Promise.all([
          getAllBanglaContent(),
          getIndianContent()
        ]);
        setBengaliContent(bengali);
        setIndianContent(indian);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Bengali Content Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">Bengali Movies & Shows</h2>
          </div>
        </div>
        <MovieGrid movies={bengaliContent} emptyMessage="No Bengali content available" />
      </section>

      {/* Indian Content Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold">Indian Movies & Shows</h2>
          </div>
        </div>
        <MovieGrid movies={indianContent} emptyMessage="No Indian content available" />
      </section>
    </div>
  ); 
}
