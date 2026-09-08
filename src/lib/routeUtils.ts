import { PAKISTAN_CITIES } from '../data/mockBuses';

export const getRouteSlug = (origin: string, destination: string): string => {
  const cleanOrigin = origin.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const cleanDest = destination.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${cleanOrigin}-to-${cleanDest}-bus-timing`;
};

export const parseRouteSlug = (slug: string): { origin: string; destination: string } | null => {
  if (!slug) return null;

  // Clean trailing keywords like -bus-timing, -bus-schedule, -bus-schedules, -bus-times, -bus, -timing
  const cleanSlug = slug.replace(/-(bus-timing|bus-schedules|bus-schedule|bus-times|bus-timing-and-fares|bus|timing)$/gi, '');

  let originPart = '';
  let destPart = '';

  const toIndex = cleanSlug.indexOf('-to-');
  if (toIndex !== -1) {
    originPart = cleanSlug.substring(0, toIndex);
    destPart = cleanSlug.substring(toIndex + 4);
  } else {
    // Fallback: split by '-to' or 'to'
    const parts = cleanSlug.split('-');
    const idx = parts.indexOf('to');
    if (idx !== -1) {
      originPart = parts.slice(0, idx).join('-');
      destPart = parts.slice(idx + 1).join('-');
    }
  }

  if (!originPart || !destPart) return null;

  const cleanForMatch = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const origClean = cleanForMatch(originPart);
  const destClean = cleanForMatch(destPart);

  // Match against canonical cities list to accurately preserve hyphens (e.g. Islamabad-Rawalpindi, Bagh-Jhang)
  const matchedOrigin = PAKISTAN_CITIES.find(c => cleanForMatch(c) === origClean);
  const matchedDest = PAKISTAN_CITIES.find(c => cleanForMatch(c) === destClean);

  const capitalize = (str: string) =>
    str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  const origin = matchedOrigin || capitalize(originPart.replace(/-/g, ' ').trim());
  const destination = matchedDest || capitalize(destPart.replace(/-/g, ' ').trim());

  if (!origin || !destination) return null;

  return {
    origin,
    destination
  };
};
