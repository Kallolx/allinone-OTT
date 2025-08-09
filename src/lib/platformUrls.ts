
// URLs for MostPlayed section
export const MOST_PLAYED_URLS = [
  "https://ww7.123moviesfree.net/top-imdb/all/",
  "https://fojik.com/movie/",
  "https://prmovies.doctor/genre/hollywood/",
  "https://prmovies.doctor/genre/web-series/",
  "https://gomovies-online.link/all-films/",
  "https://gomovies-online.link/all-films/",
  "https://netfilmapp.pics/movie/"
];

// URLs for other pages
export const OTHER_PLATFORM_URLS = [
  "https://bongobd.com/contents/popular-drama",
  "https://binge.buzz/categories/1101/vod/1",
  "https://www.bioscopeplus.com/lists/blockbuster-movies",
  "https://toffeelive.com/en/rail/generic/editorial-dynamic/e5297f588f2f244c11280a91f5961fba",
  "https://www.chorki.com/lists/new-release-movie",
  "https://www.deeptoplay.com/lists/deeptoplay-top-10"
];

// Function to get a random MostPlayed URL
export const getRandomMostPlayedUrl = () => {
  const randomIndex = Math.floor(Math.random() * MOST_PLAYED_URLS.length);
  return MOST_PLAYED_URLS[randomIndex];
};

// Function to get a random Other Platform URL
export const getRandomOtherPlatformUrl = () => {
  const randomIndex = Math.floor(Math.random() * OTHER_PLATFORM_URLS.length);
  return OTHER_PLATFORM_URLS[randomIndex];
};
