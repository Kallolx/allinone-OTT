import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";

const bangladeshiPlatforms = [
  {
    title: "Bongo BD",
    url: "https://bongobd.com/movies",
    icon: "/icons/bongo.png",
  },
  {
    title: "Chorki",
    url: "https://www.chorki.com/bn/movie",
    icon: "/icons/chorki.png",
  },
  {
    title: "Hoichoi",
    url: "https://www.hoichoi.tv/movies-all-bd",
    icon: "/icons/hoichoi.png",
  },
  {
    title: "Bioscope",
    url: "https://www.bioscopelive.com/movies",
    icon: "/icons/bioscope.png",
  },
];

const indianPlatforms = [
  {
    title: "JioCinema",
    url: "https://www.jiocinema.com/",
    icon: "/icons/jio.png",
  },
  {
    title: "SonyLIV",
    url: "https://www.sonyliv.com/custompage/movies-32693",
    icon: "/icons/sonyliv.png",
  },
  {
    title: "Zee5",
    url: "https://moviebox.ph/web/class-list?platform=Zee5",
    icon: "/icons/zee.png",
  },
];

const pakistaniPlatforms = [
  {
    title: "ARY ZAP",
    url: "https://aryzap.com/view-all/Category/dramas",
    icon: "/icons/aryzap.png",
  },
  {
    title: "Hum TV",
    url: "https://hum.tv/latest-dramas/",
    icon: "/icons/humtv.png",
  },
  {
    title: "Geo TV",
    url: "https://harpalgeo.tv/programs",
    icon: "/icons/geo.png",
  },
  {
    title: "PTV Sports",
    url: "https://ptv.com.pk/ptvglobal",
    icon: "/icons/ptv.png",
  },
  {
    title: "See Prime",
    url: "https://www.youtube.com/@seeprime/videos",
    icon: "/icons/see.png",
  },
  {
    title: "UrduFlix",
    url: "https://urduflix.com/catalog/search",
    icon: "/icons/urduflix.png",
  },
];

const internationalPlatforms = [
  {
    title: "Netflix",
    url: "https://moviebox.ph/web/class-list?platform=Netflix",
    icon: "/icons/netflix.png",
  },
  {
    title: "Amazon Prime",
    url: "https://moviebox.ph/web/class-list?platform=PrimeVideo",
    icon: "/icons/prime.png",
  },
  {
    title: "Disney+",
    url: "https://moviebox.ph/web/class-list?platform=Disney",
    icon: "/icons/disney.png",
  },
  {
    title: "Hulu",
    url: "https://moviebox.ph/web/class-list?platform=Hulu",
    icon: "/icons/hulu.png",
  },
  {
    title: "Apple TV+",
    url: "https://moviebox.ph/web/class-list?platform=AppleTV",
    icon: "/icons/apple.png",
  },
  {
    title: "HBO Max",
    url: "https://moviebox.ph/web/class-list?platform=Vivamax",
    icon: "/icons/hbo.png",
  },
  {
    title: "Showmax",
    url: "https://moviebox.ph/web/class-list?platform=Showmax",
    icon: "/icons/show.png",
  },
  {
    title: "Vivamax",
    url: "https://moviebox.ph/web/class-list?platform=Vivamax",
    icon: "/icons/viva.png",
  },
  {
    title: "Crunchyroll",
    url: "https://www.crunchyroll.com/videos/popular",
    icon: "/icons/crunchyroll.png",
  },
];

function PlatformRow({
  title,
  platforms,
}: {
  title: string;
  platforms: typeof bangladeshiPlatforms;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-3 text-left">
        {title}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 justify-start md:justify-center">
        {platforms.map((platform) => (
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
                src={platform.icon}
                alt={platform.title}
                className="w-16 rounded-full h-16 object-contain"
              />
            </div>
            <p className="mt-1 text-sm font-medium text-center text-foreground/80 group-hover:text-foreground transition-colors duration-300">
              {platform.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularPlatforms() {
  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Popular Platforms
        </h2>
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-orange-500/10 text-orange-500 rounded-md">
          HOT 🔥
        </span>
      </div>
      <PlatformRow title="Bangladeshi" platforms={bangladeshiPlatforms} />
      <PlatformRow title="Indian" platforms={indianPlatforms} />
      <PlatformRow title="Pakistani" platforms={pakistaniPlatforms} />
      <PlatformRow title="International" platforms={internationalPlatforms} />
    </section>
  );
}

export default PopularPlatforms;
