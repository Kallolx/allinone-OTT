import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, Lock, AlertCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppHeader } from "@/components/AppHeader";
import { api } from "@/lib/api";

import { Globe, Video, Film, Eye } from "lucide-react";
// Adult content platforms with PNG icons and Lucide icons fallback
const adultPlatforms = [
    {
    title: "Ullu",
    url: "https://xmasti.io/ullu/",
    icon: "/icons/ullu.png",
  },
    {
    title: "Alt Balaji",
    url: "https://xmasti.io/altt/",
    icon: "/icons/altbalaji.png",
  },
  {
    title: "Brazzers",
    url: "https://www.brazzers.com/home",
    icon: "/icons/adult/brazzers.png",
  },
  {
    title: "Pornhub",
    url: "https://www.pornhub.com/",
    icon: "/icons/adult/pornhub.png",
  },
  {
    title: "Xvideos",
    url: "https://www.xvideos.com/",
    icon: "/icons/adult/xvideos.png",
  },
  {
    title: "XHamster",
    url: "https://www.xhamster.com/",
    icon: "/icons/adult/xhamster.png",
  },
  {
    title: "Watch movies",
    url: "https://watchomovies.blog/",
    icon: "/icons/adult/watchmovies.png",
  },
  {
    title: "Wow Masti",
    url: "https://wowmasti.com/",
    icon: "/icons/adult/wowmasti.png",
  },
  {
    title: "YouPorn",
    url: "https://www.youporn.com/",
    icon: "/icons/adult/youporn.png",
  },
  {
    title: "Redtube",
    url: "https://www.redtube.com/",
    icon: "/icons/adult/redtube.png",
  },
  {
    title: "XNXX",
    url: "https://www.xnxx.com/",
    icon: "/icons/adult/xnxx.png",
  },
  {
    title: "CamSoda",
    url: "https://camsoda.com/",
    icon: "/icons/adult/camsoda.png",
  },
  {
    title: "TellyHD",
    url: "https://tellyhd.com/",
    icon: "/icons/adult/tellyhd.png",
  },
  {
    title: "EPorner",
    url: "https://eporner.com/",
    icon: "/icons/adult/eporner.png",
  },
  {
    title: "DesiX11",
    url: "https://desix11.com/",
    icon: "/icons/adult/desi.png",
  },
  {
    title: "18+ TikTok",
    url: "https://fikfap.com/",
    icon: "/icons/adult/tiktok.png",
  },
  {
    title: "Animation",
    url: "https://hentaihaven.xxx/",
    icon: "/icons/adult/hentai.png",
  },
  { title: "Ullu", url: "https://tellyhd.com/", icon: "/icons/ullu.png" },
  {
    title: "Hentai",
    url: "https://hanime.tv/",
    icon: "/icons/adult/hanime.png",
  },
  // 50 additional adult sites (all use placeholder.svg)
  {
    title: "HQHole",
    url: "http://www.hqhole.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "HD Sex Dino",
    url: "http://www.hdsexdino.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "PornBigVideo",
    url: "http://pornbigvideo.com/",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SweetShow",
    url: "http://www.sweetshow.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "MyLust",
    url: "http://mylust.com/",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SleazyNeasy",
    url: "https://www.sleazyneasy.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SexPulseTV",
    url: "http://www.sexpulse.tv",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SexMole",
    url: "http://www.sexmole.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SpankBang",
    url: "https://spankbang.com/",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "FreeAdultMedia",
    url: "https://freeadultmedia.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "BangBrosTeenPorn",
    url: "https://bangbrosteenporn.com",
    icon: "/icons/placeholder.svg",
  },
  { title: "Porn8", url: "https://porn8.com", icon: "/icons/placeholder.svg" },
  {
    title: "CollectionOfBestPorn",
    url: "http://collectionofbestporn.com/",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "FreeViewMovies",
    url: "https://freeviewmovies.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "FreeViewMovies (alt)",
    url: "https://www.freeviewmovies.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "YouPorn FR",
    url: "https://fr.youporn.com",
    icon: "/icons/placeholder.svg",
  },
  { title: "Fooxy", url: "https://fooxy.com", icon: "/icons/placeholder.svg" },
  {
    title: "CartoonTube",
    url: "https://cartoontube.com",
    icon: "/icons/placeholder.svg",
  },
  { title: "Porn.hu", url: "https://porn.hu", icon: "/icons/placeholder.svg" },
  {
    title: "BobiPorn",
    url: "https://bobiporn.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "StileProject",
    url: "https://stileproject.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "WhatAPorn",
    url: "https://whataporn.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SunPorno",
    url: "https://sunporno.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "FreeViewMovies",
    url: "https://freeviewmovies.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "YouPorn FR",
    url: "https://fr.youporn.com",
    icon: "/icons/placeholder.svg",
  },
  { title: "Fooxy", url: "https://fooxy.com", icon: "/icons/placeholder.svg" },
  {
    title: "CartoonTube",
    url: "https://cartoontube.com",
    icon: "/icons/placeholder.svg",
  },
  { title: "Porn.hu", url: "https://porn.hu", icon: "/icons/placeholder.svg" },
  {
    title: "BobiPorn",
    url: "https://bobiporn.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "StileProject",
    url: "https://stileproject.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "WhatAPorn",
    url: "https://whataporn.com",
    icon: "/icons/placeholder.svg",
  },
  {
    title: "SunPorno",
    url: "https://sunporno.com",
    icon: "/icons/placeholder.svg",
  },
];

export default function AdultPlatforms() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [correctPassword, setCorrectPassword] = useState("123456");

  const maxAttempts = 3;

  // Fetch the current adult page password
  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const passwordData = await api.getAdultPagePassword();
        setCorrectPassword(passwordData.password);
      } catch (err) {
        console.error("Failed to fetch adult password:", err);
        // Keep default password if API fails
      }
    };

    fetchPassword();
  }, []);

  // Check if user was previously authenticated in this session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("adultPlatformAuth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      sessionStorage.setItem("adultPlatformAuth", "true");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setIsBlocked(true);
        setError("Too many failed attempts. Please contact admin for access.");
      } else {
        setError(
          `Incorrect password. ${maxAttempts - newAttempts} attempts remaining.`
        );
      }
    }
    setPassword("");
  };

  const handleContactAdmin = () => {
    window.open("https://wa.me/8801998570766", "_blank");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // If not authenticated, show password modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
          <div className="mb-4 flex items-center justify-start gap-4">
            <button onClick={handleGoBack} className="focus:outline-none">
              <ArrowLeft className="mb-4" />
            </button>
            <h2 className="mb-4 text-lg font-bold">Adult Platforms</h2>
          </div>

          <Dialog open={showPasswordModal} onOpenChange={() => {}}>
            <DialogContent
              className="sm:max-w-md"
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Age Verification Required
                </DialogTitle>
                <DialogDescription>
                  Please enter the password to access adult content. You must be
                  18+ to continue.
                </DialogDescription>
              </DialogHeader>

              {!isBlocked ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      disabled={isBlocked}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isBlocked}
                    >
                      Verify
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoBack}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleContactAdmin}
                      className="flex-1 gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Admin
                    </Button>
                    <Button variant="outline" onClick={handleGoBack}>
                      Go Back
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Show placeholder content while modal is open */}
          <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Access restricted. Please verify your age.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the platforms
  return (
    <div className="max-w-6xl mx-auto bg-background">
      <AppHeader />
      {/* Marquee/slider warning */}
      <div className="w-full  border-b border-primary py-2 overflow-hidden relative">
        <div className="aurora-text whitespace-nowrap animate-marquee font-semibold text-sm px-4">
          Some websites might need VPN to work. Please connect to a fast VPN if
          a site does not load or is blocked in your region. Enjoy safe
          browsing!
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 100%;
          animation: marquee 18s linear infinite;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
        <div className="mb-4 flex items-center justify-start gap-4">
          <button onClick={() => navigate(-1)} className="focus:outline-none">
            <ArrowLeft className="mb-4" />
          </button>
          <h2 className="mb-4 text-lg font-bold">Adult Platforms</h2>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-8 gap-6">
          {adultPlatforms.map((platform) => (
            <div
              key={platform.title}
              onClick={() => window.open(platform.url, "_blank")}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              <div
                className={cn(
                  "w-20 h-20 flex items-center justify-center mb-2",
                  "transition-all duration-300 group-hover:scale-105 shadow group-hover:shadow-lg"
                )}
              >
                <img
                  src={
                    typeof platform.icon === "string"
                      ? platform.icon
                      : "/icons/placeholder.svg"
                  }
                  alt={platform.title}
                  className="w-16 h-16 rounded-full object-contain"
                />
              </div>
              <p className="mt-1 text-sm font-bold text-center text-foreground/80 group-hover:text-red-500 transition-colors duration-300">
                {platform.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
