export type ProductSlug = "space-explorer" | "fun-science" | "young-hustler" | "financial-literacy" | "ai-for-kids";

export type Mission = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  gradient: string;
  planet: string;
  thumbnail?: string;
  materials?: string[];
  steps?: string[];
};

export type Product = {
  slug: ProductSlug;
  title: string;
  activateTitle?: string;
  tagline: string;
  description: string;
  shopifyProductId: string;
  shopifyUrl: string;
  gradient: string;
  icon: string;
  mascotImage?: string;
  heroImage?: string;
};

export const products: Product[] = [
  {
    slug: "space-explorer",
    title: "Space Explorer",
    activateTitle: "The Ultimate Space Explorer Workbook - QR enabled learning",
    tagline: "Blast off into the cosmos",
    description:
      "Explore the solar system, rockets, astronauts, and the mysteries of deep space across 10 epic missions!",
    shopifyProductId: "10426881114406",
    shopifyUrl:
      "https://learnwhatmatters.in/products/the-ultimate-space-explorer-workbook",
    gradient: "from-orange-600 via-amber-500 to-yellow-400",
    icon: "🚀",
    mascotImage: "/captain-nova.png",
    heroImage: "/hero-space-explorer.jpg",
  },
  {
    slug: "fun-science",
    title: "Fun Science",
    activateTitle: "Fun & Easy Science Experiments for Kids | Home Experiments & QR Video Learning",
    tagline: "Discover the world around you",
    description:
      "Conduct experiments, explore forces, discover living things, and uncover the science behind everyday wonders!",
    shopifyProductId: "10530952642854",
    shopifyUrl: "https://learnwhatmatters.in/products/fun-easy-science-experiments-for-kids-stem-workbook",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    icon: "🔬",
    heroImage: "/hero-fun-science.jpg",
  },
  {
    slug: "financial-literacy",
    title: "Financial Literacy",
    tagline: "Master your money journey",
    description:
      "Three books, 15 video lessons — learn what money is, how to use it smartly, and how to think like a money pro!",
    shopifyProductId: "",
    shopifyUrl: "https://learnwhatmatters.in",
    gradient: "from-amber-500 via-yellow-400 to-orange-400",
    icon: "💰",
  },
  {
    slug: "young-hustler",
    title: "Young Hustler",
    activateTitle: "Teen Entrepreneurship Workbook Bundle – Startup, Business & Side Hustle Guide",
    tagline: "Build your business brain",
    description:
      "Learn money, entrepreneurship, marketing, and leadership skills to start your journey as a young entrepreneur!",
    shopifyProductId: "10532210344230",
    shopifyUrl: "https://learnwhatmatters.in/products/think-like-a-hustler-build-like-a-hustler-teen-entrepreneurship-workbook-bundle-startup-business-marketing-side-hustle-guide-for-teens-ages-12-18",
    gradient: "from-teal-600 via-emerald-500 to-green-400",
    icon: "💡",
    heroImage: "/hero-young-hustler.jpg",
  },
  {
    slug: "ai-for-kids",
    title: "AI for Kids",
    activateTitle: "AI for Kids — 3-Level Bundle",
    tagline: "Learn AI from the ground up",
    description:
      "Three books, 32 video lessons — discover what AI is, become an AI Field Operator, and level up to AI Mission Pro with AIRA!",
    shopifyProductId: "",
    shopifyUrl: "https://learnwhatmatters.in",
    gradient: "from-violet-600 via-purple-500 to-indigo-500",
    icon: "🤖",
  },
];

export const PRODUCT_ID_TO_SLUG: Record<string, ProductSlug> = {
  "10426881114406": "space-explorer",
  "10530952642854": "fun-science",
  "10532210344230": "young-hustler",
};

// Bundle product IDs that unlock multiple products at once
export const BUNDLE_ID_TO_SLUGS: Record<string, ProductSlug[]> = {
  "10547871940902": ["space-explorer", "fun-science"],
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
