import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Live TV servers data (same structure as TrendingSection)
import { getImageUrl } from "../lib/tmdb";
const liveServers = [
  {
    url: "https://crichd-new.vercel.app/",
    title: "Star Sports",
    image: getImageUrl("/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "Star Sports Hindi",
    image: getImageUrl("/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "PTV Sports",
    image: getImageUrl("/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "Willow HD",
    image: getImageUrl("/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "Ten Sports",
    image: getImageUrl("/h8gHn0OzBoaefsYseUByqsmEDMY.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "A Sports",
    image: getImageUrl("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", "w780"),
  },
  {
    url: "https://crichd-new.vercel.app/",
    title: "Sky Sports",
    image: getImageUrl("/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", "w780"),
  },
  // ...add all other channels in the same way, using the same images or new ones as needed
];

export default function LiveTVSection() {
  const navigate = useNavigate();

  const safeOpenURL = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Swiper navigation refs
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  return (
    <section className="py-8 relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-foreground">
           🔴 Live TV
          </h2>
        </div>
        <div className="flex items-center ml-auto gap-2">
          <button
            ref={prevRef}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white border border-primary transition"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white border border-primary transition"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Swiper slider for all devices */}
      <Swiper
        modules={[Navigation, Autoplay]}
        onInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={600}
        allowTouchMove={true}
      >
        {liveServers.map((server) => (
          <SwiperSlide key={server.title}>
            <div
              onClick={() => safeOpenURL(server.url)}
              className="group cursor-pointer w-full h-[90px] rounded-xl flex flex-col items-center justify-center shadow hover:shadow-md transition-all duration-300 relative overflow-hidden border-2 border-transparent hover:border-primary"
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
                <h3 className="text-2xl italic aurora-text font-bold text-center text-white drop-shadow-lg">
                  {server.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
