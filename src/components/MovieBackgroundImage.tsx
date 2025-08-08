import { useEffect, useState } from "react"
import { Movie } from "@/lib/tmdb"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar } from "lucide-react"

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export function MovieBackgroundImage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        )
        const data = await response.json()
        setMovies(data.results)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    fetchMovies()
  }, [])

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % movies.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [movies.length])

  if (!movies.length) return null

  const currentMovie = movies[currentIndex]
  
  return (
    <div className="relative w-full h-full">
      {/* Dark gradient overlay */}
      <div className="absolute inset-4 rounded-3xl z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Movie image */}
      <img
        src={`${IMAGE_BASE_URL}/original${currentMovie?.backdrop_path}`}
        alt={currentMovie?.title}
        className="absolute inset-4 rounded-3xl object-cover w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
        style={{ transition: 'opacity 0.5s ease-in-out' }}
      />

      {/* Movie info overlay */}
      <div className="absolute bottom-8 left-8 right-8 z-20 space-y-4">
        <h2 className="text-3xl font-bold text-white text-shadow-lg">
          {currentMovie?.title}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
            {currentMovie?.vote_average.toFixed(1)}/10
          </Badge>
          
          <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(currentMovie?.release_date).getFullYear()}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-200 line-clamp-2 max-w-xl">
          {currentMovie?.overview}
        </p>
      </div>
    </div>
  )
}
