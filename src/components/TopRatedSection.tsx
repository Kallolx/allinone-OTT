import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { getTopRatedMovies, type MovieDetails } from "@/lib/tmdb"
import { getRandomMostPlayedUrl } from "@/lib/platformUrls"

export function TopRatedSection() {
  const [movies, setMovies] = useState<MovieDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const topRatedMovies = await getTopRatedMovies()
      setMovies(topRatedMovies)
      setIsLoading(false)
    }
    fetchMovies()
  }, [])


  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">🔥Top Rated</h2>
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
            onClick={() => window.open(getRandomMostPlayedUrl(), '_blank')}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 text-foreground text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {movie.rating.toFixed(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                  <Badge variant="outline" className="bg-secondary text-white text-xs">
                    {movie.voteCount.toLocaleString()} votes
                  </Badge>
                  <Badge variant="outline" className="bg-background/80 text-foreground text-xs">
                    Popularity: {movie.popularity.toLocaleString()}
                  </Badge>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">
                    {movie.year} • {movie.genres.join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}