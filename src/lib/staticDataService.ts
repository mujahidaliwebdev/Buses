import { Bus } from '../types';
import { PAKISTAN_CITIES } from '../data/mockBuses';

export interface StaticStop {
  id: string;
  buses?: string[];
}

export interface StaticStopsIndex {
  stops: {
    [cityName: string]: StaticStop;
  };
}

export const staticDataService = {
  getWorkerUrl: (): string => {
    return 'https://assansafar-api.mujahidali-stf.workers.dev';
  },

  setWorkerUrl: (url: string): void => {
    // No-op or store in localStorage if needed
  },

  getD1Status: async (): Promise<any> => {
    const res = await fetch('/api/d1/status');
    return await res.json();
  },

  syncD1ToStatic: async (): Promise<any> => {
    const res = await fetch('/api/d1/sync-static', { method: 'POST' });
    return await res.json();
  },

  executeD1Sql: async (sql: string): Promise<any> => {
    const res = await fetch('/api/d1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    return await res.json();
  },

  saveD1Config: async (config: any): Promise<any> => {
    const res = await fetch('/api/d1/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  },

  testD1Connection: async (): Promise<any> => {
    const res = await fetch('/api/d1/test-connection', { method: 'POST' });
    return await res.json();
  },

  seedD1Schema: async (): Promise<any> => {
    const res = await fetch('/api/d1/seed', { method: 'POST' });
    return await res.json();
  },

  getBusesFromPartition: async (partitionFile: string): Promise<any[]> => {
    const res = await fetch('/api/d1/buses');
    if (res.ok) {
      const data = await res.json();
      return data.buses || [];
    }
    return [];
  },

  getStopsIndex: async (): Promise<StaticStopsIndex> => {
    try {
      const res = await fetch('/api/d1/cities');
      if (res.ok) {
        const data = await res.json();
        if (data.live && Array.isArray(data.cities)) {
          const stops: Record<string, StaticStop> = {};
          data.cities.forEach((cityName: string, idx: number) => {
            stops[cityName] = { id: `S${idx + 1}` };
          });
          return { stops };
        }
      }
    } catch (e) {
      // ignore
    }
    return { stops: {} };
  },

  searchBuses: async (originName: string, destinationName: string): Promise<Bus[]> => {
    const doFetch = async (orig: string, dest: string): Promise<Bus[]> => {
      try {
        const res = await fetch(`/api/d1/search?origin=${encodeURIComponent(orig.trim())}&destination=${encodeURIComponent(dest.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.live && Array.isArray(data.buses) && data.buses.length > 0) {
            return data.buses;
          }
        }
      } catch (e) {
        console.warn('D1 search error:', e);
      }
      return [];
    };

    // 1. First try exact query
    let results = await doFetch(originName, destinationName);
    if (results.length > 0) return results;

    // 2. Try alternate variations with canonical cities / hyphens / spaces
    const cleanForMatch = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const origClean = cleanForMatch(originName);
    const destClean = cleanForMatch(destinationName);

    const canonicalOrig = PAKISTAN_CITIES.find(c => cleanForMatch(c) === origClean);
    const canonicalDest = PAKISTAN_CITIES.find(c => cleanForMatch(c) === destClean);

    const origVariations = Array.from(new Set([
      originName,
      canonicalOrig,
      originName.includes('-') ? originName.replace(/-/g, ' ') : originName.replace(/\s+/g, '-')
    ].filter(Boolean) as string[]));

    const destVariations = Array.from(new Set([
      destinationName,
      canonicalDest,
      destinationName.includes('-') ? destinationName.replace(/-/g, ' ') : destinationName.replace(/\s+/g, '-')
    ].filter(Boolean) as string[]));

    for (const o of origVariations) {
      for (const d of destVariations) {
        if (o === originName && d === destinationName) continue;
        results = await doFetch(o, d);
        if (results.length > 0) return results;
      }
    }

    return [];
  },

  getAllBuses: async (): Promise<Bus[]> => {
    try {
      let d1Buses: any[] = [];
      let d1Stops: any[] = [];

      const res = await fetch('/api/d1/buses');
      if (res.ok) {
        const data = await res.json();
        if (data.live && Array.isArray(data.buses)) {
          d1Buses = data.buses;
        }
      }

      const stopsRes = await fetch('/api/d1/bus-stops').catch(() => null);
      if (stopsRes && stopsRes.ok) {
        const stopsData = await stopsRes.json();
        if (stopsData.live && Array.isArray(stopsData.stops)) {
          d1Stops = stopsData.stops;
        }
      }

      const stopsByBus: Record<string, any[]> = {};
      for (const s of d1Stops) {
        const bId = s.bus_id;
        if (!stopsByBus[bId]) stopsByBus[bId] = [];
        stopsByBus[bId].push(s);
      }

      const calculateDuration = (t1: string, t2: string): string => {
        try {
          const [h1, m1] = (t1 || '').split(':').map(Number);
          const [h2, m2] = (t2 || '').split(':').map(Number);
          if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return '8h 00m';
          let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
          if (diff < 0) diff += 24 * 60;
          return `${Math.floor(diff / 60)}h ${diff % 60}m`;
        } catch {
          return '8h 00m';
        }
      };

      const mappedD1Buses: Bus[] = d1Buses.map((b: any) => {
        const bId = b.bus_id || b.id;
        const stops = stopsByBus[bId] || [];
        stops.sort((a, b) => a.stop_sequence - b.stop_sequence);

        const firstStop = stops.length > 0 ? stops[0] : null;
        const lastStop = stops.length > 1 ? stops[stops.length - 1] : firstStop;

        const origin = firstStop ? (firstStop.city_name || 'Origin') : (b.origin || 'Lahore');
        const destination = lastStop ? (lastStop.city_name || 'Destination') : (b.destination || 'Multan');

        const depTime = firstStop?.departure_time || firstStop?.arrival_time || b.departure_time || '18:15';
        const arrTime = lastStop?.arrival_time || lastStop?.departure_time || b.arrival_time || '06:40';

        const isNonAc = (b.climate_control || '').toLowerCase().includes('non');
        const isAc = !isNonAc && (b.climate_control || '').toLowerCase().includes('ac');

        const stopsSummary = stops.map(s => s.city_name).join(', ') || b.route_map || '';

        return {
          id: bId,
          origin: origin,
          destination: destination,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: calculateDuration(depTime, arrTime),
          fare: Number(b.fare || 0) || 0,
          companyName: b.company_name || 'Asaan Safar Express',
          busNumber: b.vehicle_plate || bId,
          contactNumber: b.contact_number || '',
          terminalLocation: firstStop?.location || b.terminal_location || 'Main Terminal',
          standNumber: firstStop?.stand || b.stand_number || '0',
          isAC: isAc,
          type: (b.service_type as any) || 'Standard',
          routeMap: b.route_map || '',
          stops: stopsSummary,
          remarks: b.remarks || 'Loaded from Cloudflare D1 Edge'
        };
      });

      return mappedD1Buses;
    } catch (d1Error) {
      console.warn('Cloudflare D1 getAllBuses error:', d1Error);
      return [];
    }
  }
};
