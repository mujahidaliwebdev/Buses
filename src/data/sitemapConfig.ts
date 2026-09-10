export interface SitemapPage {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const STATIC_SITEMAP_PAGES: SitemapPage[] = [
  { loc: 'https://asaansafar.com/', lastmod: '2026-09-10', changefreq: 'daily', priority: 1.0 },
  { loc: 'https://asaansafar.com/schedules', lastmod: '2026-09-10', changefreq: 'weekly', priority: 0.8 },
  { loc: 'https://asaansafar.com/about', lastmod: '2026-09-10', changefreq: 'monthly', priority: 0.6 },
  { loc: 'https://asaansafar.com/contact', lastmod: '2026-09-10', changefreq: 'monthly', priority: 0.6 },
  { loc: 'https://asaansafar.com/blog', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.7 },
  { loc: 'https://asaansafar.com/careers', lastmod: '2026-09-10', changefreq: 'monthly', priority: 0.5 },
  { loc: 'https://asaansafar.com/team', lastmod: '2026-09-10', changefreq: 'monthly', priority: 0.5 },
  { loc: 'https://asaansafar.com/faqs', lastmod: '2026-09-10', changefreq: 'weekly', priority: 0.6 },
  { loc: 'https://asaansafar.com/sitemap', lastmod: '2026-09-10', changefreq: 'weekly', priority: 0.5 },
  { loc: 'https://asaansafar.com/policy', lastmod: '2026-08-31', changefreq: 'monthly', priority: 0.4 },
  { loc: 'https://asaansafar.com/privacy', lastmod: '2026-08-31', changefreq: 'monthly', priority: 0.4 },
  { loc: 'https://asaansafar.com/terms', lastmod: '2026-08-31', changefreq: 'monthly', priority: 0.4 },
  { loc: 'https://asaansafar.com/disclaimer', lastmod: '2026-08-31', changefreq: 'monthly', priority: 0.4 },
  // Popular Route Pages
  { loc: 'https://asaansafar.com/lahore-to-faisalabad-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/faisalabad-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/lahore-to-multan-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/multan-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/lahore-to-islamabad-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/islamabad-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/lahore-to-karachi-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/karachi-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/rawalpindi-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/lahore-to-rawalpindi-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/faisalabad-to-multan-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/multan-to-faisalabad-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/lahore-to-sargodha-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
  { loc: 'https://asaansafar.com/sargodha-to-lahore-bus-timing', lastmod: '2026-09-10', changefreq: 'daily', priority: 0.9 },
];
