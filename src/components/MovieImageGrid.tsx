import { useEffect, useState } from "react"
import { Movie } from "@/lib/tmdb"

// API configuration from tmdb.ts
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export function MovieImageGrid() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        )
        const data = await response.json()
        setMovies(data.results.slice(0, 6)) // Get first 6 movies
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 p-8 h-full">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`relative overflow-hidden rounded-2xl transition-transform hover:scale-105 
            ${index === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-[2/3]'}`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={`${IMAGE_BASE_URL}/w500${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
