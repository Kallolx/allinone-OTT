import { AppHeader } from "@/components/AppHeader";
import { HeroSection } from "@/components/HeroSection";
import PopularPlatforms from "@/components/PopularPlatforms";
import TrendingSection from "@/components/TrendingSection";
import LiveTVSection from "@/components/LiveTVSection";
import { MostPlayedSection } from "@/components/MostPlayedSection";
import { MostWatchedSection } from "@/components/MostWatchedSection";
import { TopRatedSection } from "@/components/TopRatedSection";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-background">
      <AppHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6">
        <main className="py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {isMainDashboard ? (
            <>
              <HeroSection />              
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                <TrendingSection />               
                <PopularPlatforms />
                <LiveTVSection />
                <MostPlayedSection />
                <MostWatchedSection />
              </div>
              <TopRatedSection />

              <Footer />
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
