export type ProductSlug = "space-explorer" | "fun-science" | "young-hustler";

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
  tagline: string;
  description: string;
  shopifyProductId: string;
  shopifyUrl: string;
  gradient: string;
  icon: string;
  mascotImage?: string;
};

export const products: Product[] = [
  {
    slug: "space-explorer",
    title: "Space Explorer",
    tagline: "Blast off into the cosmos",
    description:
      "Explore the solar system, rockets, astronauts, and the mysteries of deep space across 10 epic missions!",
    shopifyProductId: "10426881114406",
    shopifyUrl:
      "https://learnwhatmatters.in/products/the-ultimate-space-explorer-workbook",
    gradient: "from-orange-600 via-amber-500 to-yellow-400",
    icon: "🚀",
    mascotImage: "/captain-nova.png",
  },
  {
    slug: "fun-science",
    title: "Fun Science",
    tagline: "Discover the world around you",
    description:
      "Conduct experiments, explore forces, discover living things, and uncover the science behind everyday wonders!",
    shopifyProductId: "10530952642854",
    shopifyUrl: "https://learnwhatmatters.in/products/fun-easy-science-experiments-for-kids-stem-workbook",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    icon: "🔬",
  },
  {
    slug: "young-hustler",
    title: "Young Hustler",
    tagline: "Build your business brain",
    description:
      "Learn money, entrepreneurship, marketing, and leadership skills to start your journey as a young entrepreneur!",
    shopifyProductId: "",
    shopifyUrl: "https://learnwhatmatters.in",
    gradient: "from-purple-600 via-violet-500 to-indigo-400",
    icon: "💡",
  },
];

export const PRODUCT_ID_TO_SLUG: Record<string, ProductSlug> = {
  "10426881114406": "space-explorer",
  "10530952642854": "fun-science",
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
