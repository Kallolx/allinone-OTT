import { Search, Download, Play, User, LogOut, Film, Tv, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { searchMovies } from "@/lib/tmdb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    // Default to light mode on first load
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDark(true);
    else setDark(false);
  }, []);

  return (
    <button
      className="p-2 rounded transition hover:bg-muted"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {/* Show light mode icon first, dark mode icon after click */}
      {!dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [username, setUsername] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [isAdult, setIsAdult] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUserData = () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUsername(userData.username || null)
      setFullName(userData.full_name || null)
      setIsAdult(userData.is_adult === true || userData.is_adult === 1)
    }

    // Load initial data
    loadUserData()

    // Listen for user data updates from admin
    const handleUserDataUpdate = () => {
      loadUserData()
    }

    // Listen for custom event
    window.addEventListener('userDataUpdated', handleUserDataUpdate)
    
    // Listen for localStorage changes (for cross-tab updates)
    window.addEventListener('storage', handleUserDataUpdate)

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate)
      window.removeEventListener('storage', handleUserDataUpdate)
    }
  }, [])

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Simple debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchMovies(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSelect = (type: string, title: string) => {
    // Get the most appropriate server based on media type and user age verification
    const server = isAdult 
      ? type === 'tv' ? 'https://hdtoday.tv/home' : 'https://fmovies.to'
      : type === 'tv' ? 'https://fredflix.fun' : 'https://cinelol.top'
    
    window.open(server, '_blank')
    setSearchQuery('')
    setSearchResults([])
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUsername(null)
    setFullName(null)
    setIsAdult(false)
    navigate('/login')
  }

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (!username) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <header className="min-w-[320px] border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="text-xl font-bold">
                All in One
              </span>
            </a>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-2 md:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies/ TV Shows"
              className="pl-10 bg-input/50 border-border focus:border-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="fixed md:absolute top-full left-2 right-2 md:left-0 md:right-0 mt-2 p-2 bg-background border rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSearchSelect(result.type, result.title)}
                    className="flex items-center gap-2 md:gap-3 p-2 hover:bg-muted rounded-md cursor-pointer group"
                  >
                    {result.poster ? (
                      <img 
                        src={result.poster} 
                        alt={result.title}
                        className="w-8 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-12 bg-muted rounded flex items-center justify-center">
                        {result.type === 'movie' ? (
                          <Film className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Tv className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors truncate">
                        {result.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="whitespace-nowrap">{result.year}</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          {result.type === 'movie' ? (
                            <Film className="w-3 h-3" />
                          ) : (
                            <Tv className="w-3 h-3" />
                          )}
                          {result.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.open('http://allinoneott.com/app.apk', '_blank')}
            >
             <img src="/store.svg" alt="playstore" className="h-6 w-6" />
              Download App
            </Button>
            <DarkModeToggle />
            {!isAdult && (
              <span className="hidden md:inline-flex px-2 py-1 bg-red-500/10 text-red-500 text-sm font-medium rounded-md border border-red-500/20">
                🔞
              </span>
            )}
            {isAdult && (
              <span className="hidden md:inline-flex px-2 py-1  text-emerald-500 text-sm font-medium rounded-md border border-emerald-500/20">
                 Unlocked
              </span>
            )}
          
          {username ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-neutral-900 text-neutral-200">
                      {fullName?.slice(0, 2).toUpperCase() || username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{fullName || username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-neutral-900 text-neutral-200">
                      {fullName?.slice(0, 2).toUpperCase() || username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{fullName || username}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Member</span>
                      {isAdult && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded">
                          18+
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.open('https://wa.me/8801998570766', '_blank')}
                  className="text-white focus:text-white focus:bg-primary/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16.72 11.06a6.5 6.5 0 1 0-6.28 6.28l2.13.21a.75.75 0 0 0 .82-.82l-.21-2.13a6.5 6.5 0 0 0 3.54-3.54zm-6.22 2.22a4.5 4.5 0 1 1 4.5-4.5 4.5 4.5 0 0 1-4.5 4.5z"/></svg>
                  Update Subscription
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate('/login')}
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}