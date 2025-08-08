// API configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is not defined in environment variables')
}

export interface Movie {
  id: number
  title: string
  release_date: string
  backdrop_path: string
  poster_path: string
  overview: string
  genre_ids: number[]
  vote_average: number
  popularity: number
  vote_count: number
}

export interface MovieDetails {
  id: number
  title: string
  releaseDate: string
  year: string
  description: string
  image: string
  backdrop: string
  genres: string[]
  rating: number
  popularity: number
  voteCount: number
  language?: string // Original language of the content
}

export const getImageUrl = (path: string, size: 'original' | 'w500' | 'w780' = 'original') => {
  if (!path) return ''
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export async function getTopRatedMovies(): Promise<MovieDetails[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const data = await response.json()
    
    const genreResponse = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const genreData = await genreResponse.json()
    const genres = genreData.genres

    return data.results.slice(0, 6).map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(movie.release_date).getFullYear().toString(),
      description: movie.overview,
      image: getImageUrl(movie.poster_path, 'w500'),
      backdrop: getImageUrl(movie.backdrop_path),
      genres: movie.genre_ids.map(id => 
        genres.find((g: { id: number; name: string }) => g.id === id)?.name || ''
      ).filter(Boolean).slice(0, 2),
      rating: movie.vote_average,
      popularity: Math.round(movie.popularity),
      voteCount: movie.vote_count,
    }))
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return []
  }
}

export async function getTVShows(): Promise<MovieDetails[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const data = await response.json()
    
    const genreResponse = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const genreData = await genreResponse.json()
    const genres = genreData.genres

    return data.results.slice(0, 6).map((show: any) => ({
      id: show.id,
      title: show.name,
      releaseDate: new Date(show.first_air_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(show.first_air_date).getFullYear().toString(),
      description: show.overview,
      image: getImageUrl(show.poster_path, 'w500'),
      backdrop: getImageUrl(show.backdrop_path),
      genres: show.genre_ids.map((id: number) => 
        genres.find((g: { id: number; name: string }) => g.id === id)?.name || ''
      ).filter(Boolean).slice(0, 2),
      rating: show.vote_average,
      popularity: Math.round(show.popularity),
      voteCount: show.vote_count,
    }))
  } catch (error) {
    console.error('Error fetching TV shows:', error)
    return []
  }
}

export async function getPopularMovies(): Promise<MovieDetails[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const data = await response.json()
    
    const genreResponse = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const genreData = await genreResponse.json()
    const genres = genreData.genres

    return data.results.slice(0, 6).map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(movie.release_date).getFullYear().toString(),
      description: movie.overview,
      image: getImageUrl(movie.poster_path, 'w500'),
      backdrop: getImageUrl(movie.backdrop_path),
      genres: movie.genre_ids.map(id => 
        genres.find((g: { id: number; name: string }) => g.id === id)?.name || ''
      ).filter(Boolean).slice(0, 2), // Get first two genres
      rating: movie.vote_average,
      popularity: Math.round(movie.popularity),
      voteCount: movie.vote_count,
    }))
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return []
  }
}

export async function getTrendingMovies(): Promise<MovieDetails[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const data = await response.json()
    
    return data.results.slice(0, 5).map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(movie.release_date).getFullYear().toString(),
      description: movie.overview,
      image: getImageUrl(movie.poster_path, 'w500'),
      backdrop: getImageUrl(movie.backdrop_path),
      genres: [], // We'll fetch genres separately if needed
      rating: movie.vote_average,
    }))
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

// Simple search function
export async function getBanglaContent(contentType: 'movie' | 'tv' = 'tv'): Promise<MovieDetails[]> {
  try {
    // Fetch Bengali content
    const response = await fetch(
      `${BASE_URL}/discover/${contentType}?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_origin_country=BD&with_original_language=bn`
    )
    const data = await response.json()
    
    // Fetch genres for proper mapping
    const genreResponse = await fetch(
      `${BASE_URL}/genre/${contentType}/list?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const genreData = await genreResponse.json()
    const genres = genreData.genres

    return data.results.slice(0, 6).map((item: any) => ({
      id: item.id,
      title: contentType === 'movie' ? item.title : item.name,
      releaseDate: new Date(item.release_date || item.first_air_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(item.release_date || item.first_air_date).getFullYear().toString(),
      description: item.overview,
      image: getImageUrl(item.poster_path, 'w500'),
      backdrop: getImageUrl(item.backdrop_path),
      genres: item.genre_ids.map((id: number) => 
        genres.find((g: { id: number; name: string }) => g.id === id)?.name || ''
      ).filter(Boolean).slice(0, 2),
      rating: item.vote_average,
      popularity: Math.round(item.popularity),
      voteCount: item.vote_count,
      language: item.original_language
    }))
  } catch (error) {
    console.error('Error fetching Bengali content:', error)
    return []
  }
}

export async function getAllBanglaContent(): Promise<MovieDetails[]> {
  try {
    // Fetch both Bengali movies and TV shows
    const [movies, tvShows] = await Promise.all([
      getBanglaContent('movie'),
      getBanglaContent('tv')
    ])
    
    // Combine and shuffle the results
    const combined = [...movies, ...tvShows]
    // Fisher-Yates shuffle algorithm
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    return combined.slice(0, 6) // Return top 6 mixed results
  } catch (error) {
    console.error('Error fetching all Bengali content:', error)
    return []
  }
}

export async function getIndianContent(contentType: 'movie' | 'tv' = 'movie'): Promise<MovieDetails[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/${contentType}?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_origin_country=IN&with_original_language=hi`
    )
    const data = await response.json()
    
    const genreResponse = await fetch(
      `${BASE_URL}/genre/${contentType}/list?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const genreData = await genreResponse.json()
    const genres = genreData.genres

    return data.results.map((item: any) => ({
      id: item.id,
      title: contentType === 'movie' ? item.title : item.name,
      releaseDate: new Date(item.release_date || item.first_air_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      year: new Date(item.release_date || item.first_air_date).getFullYear().toString(),
      description: item.overview,
      image: getImageUrl(item.poster_path, 'w500'),
      backdrop: getImageUrl(item.backdrop_path),
      genres: item.genre_ids.map((id: number) => 
        genres.find((g: { id: number; name: string }) => g.id === id)?.name || ''
      ).filter(Boolean).slice(0, 2),
      rating: item.vote_average,
      popularity: Math.round(item.popularity),
      voteCount: item.vote_count,
      language: item.original_language
    }))
  } catch (error) {
    console.error('Error fetching Indian content:', error)
    return []
  }
}

export async function getAllSouthAsianContent(): Promise<MovieDetails[]> {
  try {
    // Fetch both Bengali and Indian content
    const [bengaliMovies, bengaliTVShows, indianMovies, indianTVShows] = await Promise.all([
      getBanglaContent('movie'),
      getBanglaContent('tv'),
      getIndianContent('movie'),
      getIndianContent('tv')
    ])
    
    // Combine all content
    const combined = [...bengaliMovies, ...bengaliTVShows, ...indianMovies, ...indianTVShows]
    
    // Fisher-Yates shuffle algorithm
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    return combined
  } catch (error) {
    console.error('Error fetching South Asian content:', error)
    return []
  }
}

export async function searchMovies(query: string) {
  if (!query) return []
  
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    )
    const data = await response.json()
    
    return data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 5)
      .map((item: any) => ({
        id: item.id,
        title: item.media_type === 'movie' ? item.title : item.name,
        type: item.media_type,
        year: item.release_date || item.first_air_date 
          ? new Date(item.release_date || item.first_air_date).getFullYear()
          : 'N/A',
        poster: getImageUrl(item.poster_path, 'w500')
      }))
  } catch (error) {
    console.error('Error searching:', error)
    return []
  }
}
