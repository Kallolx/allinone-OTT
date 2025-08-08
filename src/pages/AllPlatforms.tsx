import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tv,
  Monitor,
  Film,
  Clapperboard,
  Users,
  Heart,
  Music,
  Star,
  Play,
  Gamepad2,
  Baby,
  FileText,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "react-day-picker";

// Platform data with icons
const allPlatforms = [
  // Bangladeshi Platforms
  {
    title: "Bongo BD",
    url: "https://bongobd.com/movies",
    icon: "/icons/bongo.png",
    category: "Bangladesh",
    color: "bg-[#1e293b]"
  },
  {
    title: "Chorki",
    url: "https://www.chorki.com/bn/original",
    icon: "/icons/chorki.png",
    category: "Bangladesh",
    color: "bg-[#1e293b]"
  },
  {
    title: "Hoichoi",
    url: "https://www.hoichoi.tv/movies-all-bd",
    icon: "/icons/hoichoi.png",
    category: "Bangladesh",
    color: "bg-[#1e293b]"
  },
  {
    title: "Bioscope",
    url: "https://www.bioscopelive.com/movies",
    icon: "/icons/bioscope.png",
    category: "Bangladesh",
    color: "bg-[#1e293b]"
  },
  // Indian Platforms
  {
    title: "JioCinema",
    url: "https://www.jiocinema.com/",
    icon: "/icons/jio.png",
    category: "India",
    color: "bg-[#1e293b]"
  },
  {
    title: "Ullu",
    url: "https://xmasti.io/ullu/",
    icon: "/icons/ullu.png",
    category: "India",
    color: "bg-[#1e293b]"
  },
  {
    title: "Alt Balaji",
    url: "https://xmasti.io/altt/",
    icon: "/icons/altbalaji.png",
    category: "India",
    color: "bg-[#1e293b]"
  },
  {
    title: "SonyLIV",
    url: "https://www.sonyliv.com/custompage/movies-32693",
    icon: "/icons/sonyliv.png",
    category: "India",
    color: "bg-[#1e293b]"
  },
  {
    title: "Netflix",
    url: "https://moviebox.ph/web/class-list?platform=Netflix",
    icon: "/icons/netflix.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Amazon Prime",
    url: "https://moviebox.ph/web/class-list?platform=PrimeVideo",
    icon: "/icons/prime.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Disney+",
    url: "https://moviebox.ph/web/class-list?platform=Disney",
    icon: "/icons/disney.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Hulu",
    url: "https://moviebox.ph/web/class-list?platform=Hulu",
    icon: "/icons/hulu.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Apple TV+",
    url: "https://moviebox.ph/web/class-list?platform=AppleTV",
    icon: "/icons/apple.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "HBO Max",
    url: "https://moviebox.ph/web/class-list?platform=Vivamax",
    icon: "/icons/hbo.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Showmax",
    url: "https://moviebox.ph/web/class-list?platform=Showmax",
    icon: "/icons/show.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Vivamax",
    url: "https://moviebox.ph/web/class-list?platform=Vivamax",
    icon: "/icons/viva.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  {
    title: "Zee5",
    url: "https://moviebox.ph/web/class-list?platform=Zee5",
    icon: "/icons/zee.png",
    category: "India",
    color: "bg-[#1e293b]"
  },
  {
    title: "Crunchyroll",
    url: "https://www.crunchyroll.com/videos/popular",
    icon: "/icons/crunchyroll.png",
    category: "International",
    color: "bg-[#1e293b]"
  },
  // --- Provided platforms ---
  { url: "https://yupmovie.in/", title: "SERVER 3", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://mhbd.store/", title: "SERVER 4", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://cinelol.top/", title: "SERVER 5", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://iosmirror.cc/home", title: "SERVER 6", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://prmovies.im/", title: "SERVER 7", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://hilalplay.com/", title: "Islamic Server", description: "Islamic content and programs", icon: Star, category: "Religious", color: "bg-emerald-500" },
  { url: "https://fojik.site/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://joya9tv.com/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://mlsbd.tv/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://hdtoday.tv/home/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://ww2.123moviesfree.net/home/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://gomovies-online.link/home", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://moviedokan.lol/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://katmoviehd.foo/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://southfreak.wiki/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://hurawatch-official.com/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://vegamovies.lt/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://freemovieswatch.cc/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://wmovies.top/fbox-official/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://fbox.icu/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://www.braflix.ru/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://wmovies.top/fbox/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://hdmovie2.black/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://fboxz-to.com/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://hdtoday.tv/home/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://freemovieswatch.cc/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://vegamovies.gifts/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://katmovie.bid/", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://www.netfilmapp.pics/home", title: "Movies Server", description: "Movies Server", icon: Play, category: "Movies", color: "bg-blue-900" },
  { url: "https://www.hdjan24.pro/", title: "All Download Server", description: "All Download Server", icon: FileText, category: "Download", color: "bg-slate-700" },
  { url: "https://moviesmod.bot/anime/", title: "Anime Server", description: "Anime Server", icon: Gamepad2, category: "Animation", color: "bg-cyan-500" },
  { url: "https://animeflix.shop/", title: "Anime Server", description: "Anime Server", icon: Gamepad2, category: "Animation", color: "bg-cyan-500" },
  { url: "https://www.netfilmapp.pics/genre/animation", title: "Animation Server", description: "Animation Server", icon: Baby, category: "Animation", color: "bg-lime-500" },
];


const safeOpenURL = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function AllPlatforms() {
  // Always scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const navigate = useNavigate();

  // Load user data to check adult status
  useEffect(() => {
    const loadUserData = () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setIsAdult(userData.is_adult === true || userData.is_adult === 1);
    };

    loadUserData();

    const handleUserDataUpdate = () => {
      loadUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    window.addEventListener('storage', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
      window.removeEventListener('storage', handleUserDataUpdate);
    };
  }, []);

  const handlePlatformClick = (url: string, title: string) => {
    if (title === "Adult") {
      if (!isAdult) {
        alert("Access denied. Adult content is restricted.");
        return;
      }
      navigate("/adult");
    } else {
      safeOpenURL(url);
    }
  };

  // Filter platforms based on selected category and adult access
  const filteredPlatforms = allPlatforms.filter(platform => {
    // Hide adult content if user is not adult
    if (platform.title === "Adult" && !isAdult) {
      return false;
    }
    // Filter by category
    if (selectedCategory === "All") {
      return true;
    }
    return platform.category === selectedCategory;
  });

  // Get unique categories for filter (fix: allow duplicate category names, but only unique in tabs)
  const categoriesSet = new Set<string>();
  allPlatforms.forEach(platform => {
    if (platform.title !== "Adult" || isAdult) {
      categoriesSet.add(platform.category);
    }
  });
  const categories = ["All", ...Array.from(categoriesSet)];

  return (
    <div className="mx-auto max-w-6xl bg-background">
      <AppHeader />
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Platforms</h1>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredPlatforms.map((platform, idx) => {
            return (
              <div
                key={platform.url + idx}
                onClick={() => handlePlatformClick(platform.url, platform.title)}
                className="cursor-pointer bg-muted rounded-lg p-4 flex flex-col items-center text-center"
              >
                <div className={`mb-2 p-2 rounded-full ${platform.color} text-white flex items-center justify-center`}>
                  {typeof platform.icon === 'string' ? (
                    <img src={platform.icon} alt={platform.title} className="w-10 h-10 object-contain rounded-full" />
                  ) : (
                    React.createElement(platform.icon, { size: 28 })
                  )}
                </div>
                <div className="font-semibold text-base text-white mb-1 truncate w-full">{platform.title}</div>
                <span className="inline-block px-2 py-0.5 border border-gray-400 bg-muted text-xs rounded text-gray-400">{platform.category}</span>
              </div>
            );
          })}
        </div>

        {filteredPlatforms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No platforms found for the selected category.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
