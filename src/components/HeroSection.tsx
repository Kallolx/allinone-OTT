import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getTrendingMovies, type MovieDetails } from "@/lib/tmdb"

export function HeroSection() {
  const [movies, setMovies] = useState<MovieDetails[]>([])
  const [currentMovie, setCurrentMovie] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const movie = movies[currentMovie]

  // Auto-slide effect
  useEffect(() => {
    if (!movies.length) return;
    const timer = setTimeout(() => {
      setCurrentMovie((prev) => (prev + 1) % movies.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [currentMovie, movies.length]);

  useEffect(() => {
    const fetchMovies = async () => {
      const trendingMovies = await getTrendingMovies()
      setMovies(trendingMovies)
      setIsLoading(false)
    }
    fetchMovies()
  }, [])

  const nextSlide = () => {
    setCurrentMovie((prev) => (prev + 1) % movies.length)
  }

  const prevSlide = () => {
    setCurrentMovie((prev) => (prev - 1 + movies.length) % movies.length)
  }

  if (isLoading || !movie) {
    return (
      <section className="relative h-[230px] sm:h-[240px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-lg bg-gray-900 animate-pulse" />
    )
  }

  return (
    <section className="relative h-[230px] sm:h-[240px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-lg bg-gray-900">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/55 to-transparent" />
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col justify-end sm:justify-center h-full p-4 sm:p-8 md:p-12"
          >
            <div className="max-w-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-white/90 text-sm sm:text-lg font-medium">{movie.releaseDate}</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {movie.genres.map((genre, i) => (
                    <span key={i} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-white/90 text-xs sm:text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-white/80 mb-4 sm:mb-8 line-clamp-2 max-w-[90%] sm:max-w-none">{movie.description}</p>
              
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm sm:text-base text-white/90 font-medium">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm sm:text-base text-white/60">{movie.year}</span>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <button className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white text-gray-900 font-semibold hover:bg-white/90 transition-colors">
                  Watch now
                </button>
                <button className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
                  Trailer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - right aligned on mobile, centered on larger screens */}
      <div className="absolute right-4 sm:right-auto sm:left-1/2 bottom-4 sm:bottom-8 sm:-translate-x-1/2 flex gap-2 sm:gap-4 z-20">
        <motion.button 
          onClick={prevSlide}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </motion.button>
        <motion.button 
          onClick={nextSlide}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </motion.button>
      </div>
    </section>
  )
}