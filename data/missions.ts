export type Mission = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string; // Shopify CDN URL — fill these in
  gradient: string; // Tailwind gradient classes for card
  planet: string;   // emoji planet for visual flair
};

export const missions: Mission[] = [
  {
    id: 1,
    title: "Mission 1",
    subtitle: "Meet the Solar System",
    description: "Blast off and fly around the Sun to meet all 8 planets — from tiny Mercury to windy Neptune — on your first real space journey!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/6f9c1a48f756462fab2b3435d1e67508.mp4",
    gradient: "from-orange-600 via-yellow-500 to-amber-400",
    planet: "🪐",
  },
  {
    id: 2,
    title: "Mission 2",
    subtitle: "Earth & The Moon",
    description: "Stay close to home and discover the amazing teamwork between Planet Earth and its special friend the Moon — creating day, night, months, and tides!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/bdb49e88e615430f84372522a1129f9a.mp4",
    gradient: "from-blue-600 via-teal-500 to-green-400",
    planet: "🌍",
  },
  {
    id: 3,
    title: "Mission 3",
    subtitle: "Rockets & How They Fly",
    description: "Learn how rockets blast off, fly into space, and escape Earth's gravity — the secret power that sends astronauts to the Moon and beyond!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/3ab7fc80183a49c6a86002736e1e198a.mp4",
    gradient: "from-red-600 via-orange-500 to-yellow-400",
    planet: "🚀",
  },
  {
    id: 4,
    title: "Mission 4",
    subtitle: "Life of an Astronaut",
    description: "Discover what it's really like to live, work, eat, sleep, and float in space aboard the International Space Station — astronaut life is SUPER interesting!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/280b3cbc4bcc40a2aeb7a3d18dc3d234.mp4",
    gradient: "from-blue-700 via-indigo-600 to-blue-400",
    planet: "🧑‍🚀",
  },
  {
    id: 5,
    title: "Mission 5",
    subtitle: "Star Patterns & Galaxies",
    description: "Leave the planets behind and zoom into deep space — where billions of stars shine, constellations form magical patterns, and gigantic galaxies swirl like cosmic storms!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/0ec6d65d3fc9485c861f5bc16d08fe34.mp4",
    gradient: "from-purple-700 via-violet-600 to-indigo-500",
    planet: "✨",
  },
  {
    id: 6,
    title: "Mission 6",
    subtitle: "Asteroids, Meteors & Comets",
    description: "Head into the space rock zone — where asteroids float, comets glow with icy tails, and tiny meteors streak across the night sky with Captain Nova!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/92e333683b4c470c9773697def1d0fbc.mp4",
    gradient: "from-slate-600 via-stone-500 to-amber-600",
    planet: "☄️",
  },
  {
    id: 7,
    title: "Mission 7",
    subtitle: "Satellites & Space Technology",
    description: "Learn about satellites — the silent superheroes flying above Earth that help us talk, watch weather, use GPS, take space photos, and explore the universe!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/aaad6c10988242f09950e1b9f1e99f0c.mp4",
    gradient: "from-cyan-600 via-blue-500 to-indigo-500",
    planet: "📡",
  },
  {
    id: 8,
    title: "Mission 8",
    subtitle: "Space Weather & Solar Storms",
    description: "Discover that space has weather too — solar winds, magnetic storms, and dancing auroras. Explore the Sun's incredible secret power and how Earth stays safe!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/9d623686b8604dd1a723446133e5fc9c.mp4",
    gradient: "from-yellow-500 via-orange-400 to-red-500",
    planet: "🌤️",
  },
  {
    id: 9,
    title: "Mission 9",
    subtitle: "Black Holes & Extreme Space",
    description: "Enter the most mysterious part of the universe — where giant stars explode into supernovas, new stars are born in colorful nebulae, and powerful black holes shape the cosmos!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/94d03a0dc845490680240ba849322ae7.mp4",
    gradient: "from-gray-900 via-purple-900 to-violet-700",
    planet: "🕳️",
  },
  {
    id: 10,
    title: "Mission 10",
    subtitle: "Build Your Own Space Habitat",
    description: "You've explored the whole universe — now design your very own Space Habitat on another planet! Learn how engineers build homes in space and become a real space engineer!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/60f46947250240d5bf6252edc644518e.mp4",
    gradient: "from-teal-600 via-emerald-500 to-purple-600",
    planet: "🛸",
  },
];
