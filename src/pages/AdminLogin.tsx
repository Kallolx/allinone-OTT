import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log('Attempting login with:', { username, password })
      const { admin } = await api.adminLogin(username, password)
      console.log('Login successful:', admin)
      // Store the complete admin object
      localStorage.setItem("isAdmin", "true")
      localStorage.setItem("admin", JSON.stringify(admin))
      navigate("/admin")
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.8))]">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYwek01OCA1OFYySDJ2NTZoNTZ6IiBmaWxsPSIjMjEyMTIxIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
        {/* Moving Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Logo and Title */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-400">Enter your credentials to continue</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-sm border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-medium text-center text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-gray-400">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "bg-white/5 border-white/10 focus:border-primary focus:ring-primary/25",
                  "h-10 px-3 text-white placeholder:text-gray-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-400">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "bg-white/5 border-white/10 focus:border-primary focus:ring-primary/25",
                  "h-10 px-3 text-white placeholder:text-gray-500"
                )}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
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
                  <Shield className="h-4 w-4" />
                  <span>Login to Admin</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
