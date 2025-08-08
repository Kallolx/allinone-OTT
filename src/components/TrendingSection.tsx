import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getImageUrl } from "../lib/tmdb";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Category servers data
const categoryServers = [
  {
    url: "https://fredflix.fun/",
    title: "Live TV",
    image: getImageUrl("/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", "w780"),
  },
  {
    url: "https://moviebox.ph/web/tv-series",
    title: "TV Shows",
    image: getImageUrl("/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg", "w780"),
  },
  {
    url: "https://moviebox.ph/web/film",
    title: "Hollywood",
    image: getImageUrl("/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg", "w780"),
  },
  {
    url: "https://moviebox.ph/web/film",
    title: "Bollywood",
    image: getImageUrl("/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg", "w780"),
  },
  {
    url: "https://moviebox.ng/web/class-list?platform=Disney&utm_source=",
    title: "Adult",
    image: getImageUrl("/qJ2tW6WMUDux911r6m7haRef0WH.jpg", "w780"),
    isAdult: true,
  },
  {
    url: "https://moviebox.ph/web/film",
    title: "K-Drama",
    image: getImageUrl("/h8gHn0OzBoaefsYseUByqsmEDMY.jpg", "w780"),
  },
  {
    url: "https://prmovies.im/",
    title: "Bangla Drama",
    image: getImageUrl("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", "w780"),
  },
  {
    url: "https://hilalplay.com/",
    title: "Islamic",
    image: getImageUrl("/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg", "w780"), // The Batman
  },
  {
    url: "https://fojik.site/",
    title: "Movies",
    image: getImageUrl("/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", "w780"), // Interstellar
  },
  {
    url: "https://moviesmod.bot/anime/",
    title: "Anime",
    image: getImageUrl("/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg", "w780"), // John Wick 4
  },
  {
    url: "https://moviebox.ph/web/animated-series",
    title: "Cartoons",
    image: getImageUrl("/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", "w780"), // Fast X
  },
  {
    url: "https://www.netfilmapp.pics/genre/animation",
    title: "Documentary",
    image: getImageUrl("/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg", "w780"), // The Super Mario Bros. Movie
  },
];


const safeOpenURL = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function TrendingSection() {
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const navigate = useNavigate();

  // Load user data to check adult status
  useEffect(() => {
    const loadUserData = () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setIsAdult(userData.is_adult === true || userData.is_adult === 1);
    };

    // Load initial data
    loadUserData();

    // Listen for user data updates
    const handleUserDataUpdate = () => {
      loadUserData();
    };

    // Listen for custom event from admin updates
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    window.addEventListener('storage', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
      window.removeEventListener('storage', handleUserDataUpdate);
    };
  }, []);

  // Separate Adult card from other servers
  const adultServer = categoryServers.find(server => server.isAdult);
  const otherServers = categoryServers.filter(server => !server.isAdult);
  
  // Show adult card only if user is adult
  const showAdultCard = isAdult && adultServer;
  const handleServerClick = (url, title) => {
    if (title === "Adult") {
      // Check if user is adult before allowing access
      if (!isAdult) {
        // Optionally show a message or redirect to login
        alert("Access denied. Adult content is restricted.");
        return;
      }
      // Navigate to internal adult page
      navigate("/adult");
    } else {
      safeOpenURL(url);
    }
  };

  return (
    <section className="relative mt-4">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-foreground">🔥Trending Platforms</h2>
        </div>
        <div className="flex items-center ml-auto gap-2">
          <button 
            onClick={() => navigate("/all-platforms")}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            See All
          </button>
        </div>
      </div>

      {/* Container with Adult card on left and slider on right */}
      <div className={`flex gap-4 w-full ${showAdultCard ? 'overflow-hidden' : ''}`}>
        {/* Fixed Adult Card on Left */}
        {showAdultCard && (
          <div className="w-28 sm:w-32 flex-shrink-0">
            <div
              onClick={() => handleServerClick(adultServer.url, adultServer.title)}
              className="group cursor-pointer w-full h-[90px] rounded-xl flex flex-col items-center justify-center shadow hover:shadow-md transition-all duration-300 relative overflow-hidden border-2 border-transparent hover:border-primary"
            >
              {/* Image background with effects */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${adultServer.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(0.7) contrast(1.2)",
                }}
              />
              {/* Overlay on top of the image */}
              <div className="absolute inset-0 bg-gradient-to-b bg-black/70 z-10" />
              <div className="relative z-20 flex flex-col items-center justify-center h-full">
                <h3 className="text-xl sm:text-2xl italic aurora-text font-bold text-center text-white drop-shadow-lg">
                  {adultServer.title}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Swiper slider for other cards */}
        <div className={`${showAdultCard ? 'flex-1 min-w-0' : 'w-full'} overflow-hidden`}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={600}
            allowTouchMove={true}
          >
            {otherServers.map((server) => (
              <SwiperSlide key={server.title} style={{ width: 'auto' }}>
                <div
                  onClick={() => handleServerClick(server.url, server.title)}
                  className="group cursor-pointer w-28 sm:w-32 h-[90px] rounded-xl flex flex-col items-center justify-center shadow hover:shadow-md transition-all duration-300 relative overflow-hidden border-2 border-transparent hover:border-primary"
                >
                  {/* Image background with effects */}
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url(${server.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "brightness(0.7) contrast(1.2)",
                    }}
                  />
                  {/* Overlay on top of the image */}
                  <div className="absolute inset-0 bg-gradient-to-b bg-black/70 z-10" />
                  <div className="relative z-20 flex flex-col items-center justify-center h-full">
                    <h3 className="text-xl sm:text-2xl italic aurora-text font-bold text-center text-white drop-shadow-lg">
                      {server.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}