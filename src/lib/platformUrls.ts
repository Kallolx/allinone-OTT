// Array of platform URLs to randomly select from
export const PLATFORM_URLS = [
  "https://moviebox.ng/web/class-list?platform=Netflix&utm_source=",
  "https://moviebox.ng/web/class-list?platform=PrimeVideo&utm_source=",
  "https://moviebox.ng/web/class-list?platform=AppleTV&utm_source=",
  "https://moviebox.ng/web/class-list?platform=Disney&utm_source=",
  "https://moviebox.ng/web/class-list?platform=Hulu&utm_source=",
  "https://moviebox.ng/web/class-list?platform=Showmax&utm_source=",
  "https://moviebox.ng/web/class-list?platform=Vivamax&utm_source=",
  "https://moviebox.ng/web/class-list?platform=Zee5&utm_source="
];

// Function to get a random platform URL
export const getRandomPlatformUrl = () => {
  const randomIndex = Math.floor(Math.random() * PLATFORM_URLS.length);
  return PLATFORM_URLS[randomIndex];
};
