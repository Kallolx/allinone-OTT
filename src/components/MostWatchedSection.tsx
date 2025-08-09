import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTVShows, type MovieDetails } from "@/lib/tmdb"
import { Star } from "lucide-react"
import { getRandomMostPlayedUrl } from "@/lib/platformUrls"


export function MostWatchedSection() {
  const [shows, setShows] = useState<MovieDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      const popularShows = await getTVShows()
      setShows(popularShows)
      setIsLoading(false)
    }
    fetchShows()
  }, [])

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Most Watched</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 h-48 sm:h-56 md:h-64 rounded-lg mb-3" />
              <div className="bg-gray-800 h-4 w-2/3 rounded mb-2" />
              <div className="bg-gray-800 h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">🔥Most Watched</h2>
        <button
          className="text-primary md:text-lg hover:text-primary/80 transition-colors text-xs font-medium"
          onClick={() => navigate('/dashboard/movies')}
        >
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shows.map((show) => (
          <Card 
            key={show.id}
            className="group cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card border-border overflow-hidden"
            onClick={() => window.open(getRandomMostPlayedUrl(), '_blank')}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={show.image} 
                  alt={show.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 text-foreground text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {show.rating.toFixed(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                  <Badge variant="outline" className="bg-secondary text-white text-xs">
                    {show.popularity.toLocaleString()}+ views
                  </Badge>
                  <Badge variant="outline" className="bg-background/80 text-foreground text-xs">
                    {show.voteCount.toLocaleString()} votes
                  </Badge>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {show.title}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">
                    {show.year} • {show.genres.join(', ')}
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