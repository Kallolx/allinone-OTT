import { cn } from "@/lib/utils";
import {
  bangladeshiPlatforms,
  indianPlatforms,
  pakistaniPlatforms,
  internationalPlatforms
} from "@/lib/platforms";

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
