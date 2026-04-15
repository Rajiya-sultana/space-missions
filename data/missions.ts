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
    subtitle: "Our Solar System",
    description: "Blast off and explore our solar system — 8 planets, one giant star, and endless adventure!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/6f9c1a48f756462fab2b3435d1e67508.mp4",
    gradient: "from-orange-600 via-yellow-500 to-amber-400",
    planet: "🌍",
  },
  {
    id: 2,
    title: "Mission 2",
    subtitle: "The Sun — Our Star",
    description: "Zoom towards our dazzling star and discover why life on Earth depends on it.",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/bdb49e88e615430f84372522a1129f9a.mp4",
    gradient: "from-yellow-500 via-orange-400 to-red-500",
    planet: "☀️",
  },
  {
    id: 3,
    title: "Mission 3",
    subtitle: "Planet Earth",
    description: "Take a breathtaking view of our home planet from space and learn what makes it special.",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/3ab7fc80183a49c6a86002736e1e198a.mp4",
    gradient: "from-blue-600 via-teal-500 to-green-400",
    planet: "🌏",
  },
  {
    id: 4,
    title: "Mission 4",
    subtitle: "The Moon",
    description: "Land on the Moon with Captain Nova and uncover its craters, seas, and secrets!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/280b3cbc4bcc40a2aeb7a3d18dc3d234.mp4",
    gradient: "from-slate-500 via-gray-400 to-slate-300",
    planet: "🌕",
  },
  {
    id: 5,
    title: "Mission 5",
    subtitle: "Rocky Planets",
    description: "Visit Mercury, Venus, and Mars — the rocky neighbours of our solar system.",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/0ec6d65d3fc9485c861f5bc16d08fe34.mp4",
    gradient: "from-red-700 via-orange-600 to-amber-500",
    planet: "🔴",
  },
  {
    id: 6,
    title: "Mission 6",
    subtitle: "Jupiter & Saturn",
    description: "Marvel at the giants — Jupiter's Great Red Spot and Saturn's stunning rings!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/92e333683b4c470c9773697def1d0fbc.mp4",
    gradient: "from-amber-700 via-yellow-600 to-orange-400",
    planet: "🪐",
  },
  {
    id: 7,
    title: "Mission 7",
    subtitle: "Ice Giants",
    description: "Venture to the coldest edges — icy Uranus and mysterious Neptune await.",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/aaad6c10988242f09950e1b9f1e99f0c.mp4",
    gradient: "from-cyan-600 via-blue-500 to-indigo-500",
    planet: "🫧",
  },
  {
    id: 8,
    title: "Mission 8",
    subtitle: "Stars & Galaxies",
    description: "Zoom beyond our solar system and discover billions of stars and swirling galaxies.",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/9d623686b8604dd1a723446133e5fc9c.mp4",
    gradient: "from-purple-700 via-violet-600 to-indigo-500",
    planet: "✨",
  },
  {
    id: 9,
    title: "Mission 9",
    subtitle: "Astronauts in Space",
    description: "Learn how brave astronauts eat, sleep, and work in zero gravity!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/94d03a0dc845490680240ba849322ae7.mp4",
    gradient: "from-blue-700 via-indigo-600 to-blue-400",
    planet: "👨‍🚀",
  },
  {
    id: 10,
    title: "Mission 10",
    subtitle: "Rockets & Space Travel",
    description: "Discover how mighty rockets launch humans into space — and what the future of travel looks like!",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/60f46947250240d5bf6252edc644518e.mp4",
    gradient: "from-rose-600 via-pink-500 to-purple-600",
    planet: "🚀",
  },
];
