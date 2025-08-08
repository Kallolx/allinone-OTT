import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, AlertCircle, Ticket, MessageCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { MovieBackgroundImage } from "@/components/MovieBackgroundImage"

export default function Login() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple validation
    if (!username) {
      setError("Please enter your username")
      setLoading(false)
      return
    }

    try {
      const response = await api.verifyUser(username)
      if (response.success && response.user) {
        // Store the complete user data
        localStorage.setItem("user", JSON.stringify(response.user))
        // Also store individual fields for backward compatibility
        localStorage.setItem("username", response.user.username)
        localStorage.setItem("userId", response.user.id.toString())
        navigate("/dashboard")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid username. Please contact admin.")
    } finally {
      setLoading(false)
    }
  }

  const handleBuySubscription = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdxtisipIphEGNYmK0mBsHZOdW_YG1rHuhs5FhCKUlUYblq7A/viewform?embedded=true", '_blank')
  }

  const handleContactAdmin = () => {
    window.open("https://wa.me/8801998570766", '_blank')
  }

  return (
    <div className="min-h-screen bg-ghost flex relative overflow-hidden">
      {/* Left Side Movie Background */}
      <div className="hidden lg:block w-[60%] relative overflow-hidden">
        <MovieBackgroundImage />
      </div>

      {/* Right Side Content */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-4">
        {/* Logo and Title */}
        <div className="text-center mb-6 z-10">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" className="w-18 h-24" />
          </div>
        </div>

        {/* Main Card */}
      <Card className="w-full max-w-sm border-white/5 bg-background backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-medium text-center text-white">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your Access Key"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-primary focus:ring-primary/25",
                    "h-10 px-3 text-white placeholder:text-gray-500"
                  )}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 backdrop-blur">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>Start Watching</span>
                </div>
              )}
            </Button>
          </form>

          <div className="space-y-4 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black/40 px-2 text-gray-400">Need help?</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                onClick={handleBuySubscription}
              >
                <Ticket className="h-4 w-4 mr-2" />
                Subscriptions
              </Button>

              <Button 
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                onClick={handleContactAdmin}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </CardContent>        
      </Card>
      <div className="mt-6">
        <p className="text-sm text-gray-400 text-center">
          An All in One OTT Platform for Movies and More
        </p>
      </div>
      </div>
    </div>
  )
}