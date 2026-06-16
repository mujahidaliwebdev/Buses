export interface BlogPost {
  id: number;
  title: string;
  image: string;
  imageOverlayText: string;
  date: string;
  slug: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "Best non-AC Buses in Pakistan: A Budget Traveler's Guide",
    imageOverlayText: "BEST NON-AC BUSES IN PAKISTAN",
    date: "12 May 2026",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069",
    slug: "best-non-ac-buses-pakistan",
    excerpt: "Discover the most reliable and affordable non-AC bus services connecting major cities in Pakistan. We review seating comfort, punctuality, and pricing.",
    author: "Asaan Team",
    readTime: "6 min read",
    category: "Travel Guide"
  },
  {
    id: 2,
    title: "Lahore to Faisalabad: Best Routes and Timings for 2026",
    imageOverlayText: "LAHORE TO FAISALABAD ROUTE GUIDE",
    date: "10 May 2026",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=2071",
    slug: "lahore-to-faisalabad-guide",
    excerpt: "Planning a trip from Lahore to Faisalabad? Here is everything you need to know about the fastest routes, latest ticket prices, and bus schedules.",
    author: "Safar Specialist",
    readTime: "8 min read",
    category: "Route Guide"
  },
  {
    id: 3,
    title: "How to Find Cheap Bus Routes in Pakistan",
    imageOverlayText: "FIND CHEAP BUS ROUTES IN PAKISTAN",
    date: "05 May 2026",
    image: "https://images.unsplash.com/photo-1544621448-316223204907?auto=format&fit=crop&q=80&w=2069",
    slug: "cheap-bus-routes-pakistan",
    excerpt: "Learn the secrets to finding the lowest fares for inter-city travel. Save money on your next journey without compromising on safety or reliability.",
    author: "Local Explorer",
    readTime: "5 min read",
    category: "Tips & Tricks"
  }
];
