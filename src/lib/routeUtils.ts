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

  const origin = originPart.replace(/-/g, ' ').trim();
  const destination = destPart.replace(/-/g, ' ').trim();

  if (!origin || !destination) return null;

  const capitalize = (str: string) =>
    str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return {
    origin: capitalize(origin),
    destination: capitalize(destination)
  };
};
