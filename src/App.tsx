import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AllMovies from "./pages/AllMovies";
import AllPlatforms from "./pages/AllPlatforms";
import AdultPlatforms from "./pages/AdultPlatforms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth guard component for normal users
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("username") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Auth guard component for adult content
const RequireAdultAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("username") !== null;
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdult = userData.is_adult === true || userData.is_adult === 1;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdult) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          >
            <Route path="movies" element={<AllMovies />} />
          </Route>
          <Route 
            path="/adult" 
            element={
              <RequireAdultAuth>
                <AdultPlatforms />
              </RequireAdultAuth>
            } 
          />
          <Route 
            path="/all-platforms" 
            element={
              <RequireAuth>
                <AllPlatforms />
              </RequireAuth>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
