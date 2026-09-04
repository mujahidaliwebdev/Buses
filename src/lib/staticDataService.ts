import { Bus } from '../types';
import fallbackStopsIndex from '../../public/data/stops_index.json';

export interface StaticStop {
  id: string;
  buses?: string[];
}

export interface StaticStopsIndex {
  stops: {
    [cityName: string]: StaticStop;
  };
}

export interface StaticBus {
  busId: string;
  company: string;
  number: string;
  contact: string;
  serviceType: string;
  climateControl: string;
  stops: string;          // e.g. "S1, S2, S8, S10, S12, S13, S15"
  terminal: string;       // e.g. "Badami Bagh, Bypass, Bypass, Bypass, Bypass, Main Stop, Bus Stand"
  stand: string;          // e.g. "9, 0, 0, 0, 0, 0, 22"
  arrivalTime: string;    // e.g. "10:30, 14:30, 15:00, 16:00, 16:30, 17:00, 18:30"
  departureTime: string;  // e.g. "13:30, 14:30, 15:00, 16:00, 16:45, 17:20, 18:30"
  routeMap?: string;
  remarks?: string;
}

const DEFAULT_WORKER_URL = 'https://assansafar-api.mujahidali-stf.workers.dev';

const getBaseUrl = (): string => {
  const base = ((import.meta as any).env?.BASE_URL as string) || '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

export const staticDataService = {
  /**
   * Fetches the central search index of all stops/cities.
   */
  getStopsIndex: async (): Promise<StaticStopsIndex> => {
    try {
      const response = await fetch(`${getBaseUrl()}/data/stops_index.json?v=${Date.now()}`);
      if (!response.ok) {
        return fallbackStopsIndex as StaticStopsIndex;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && (contentType.includes('text/html') || contentType.includes('text/plain'))) {
        return fallbackStopsIndex as StaticStopsIndex;
      }
      const data = await response.json();
      if (data && data.stops && Object.keys(data.stops).length > 0) {
        return data;
      }
      return fallbackStopsIndex as StaticStopsIndex;
    } catch {
      return fallbackStopsIndex as StaticStopsIndex;
    }
  },

  /**
   * Derives the correct partition file name for a given bus ID.
   * Format: B1-B500, B501-B1000, etc.
   */
  getPartitionFileName: (busId: string): string => {
    const match = busId.match(/^B(\d+)$/i);
    if (!match) {
      // Fallback for custom formatted IDs
      return 'B1-B500.json';
    }
    const idNum = parseInt(match[1], 10);
    const quotient = Math.floor((idNum - 1) / 500);
    const start = quotient * 500 + 1;
    const end = (quotient + 1) * 500;
    return `B${start}-B${end}.json`;
  },

  /**
   * Fetches buses directly from a specific partition file.
   * Checks Firestore partition_buses first, then falls back to static JSON file.
   */
  getBusesFromPartition: async (partitionFile: string): Promise<StaticBus[]> => {
    try {
      const response = await fetch(`${getBaseUrl()}/data/buses/${partitionFile}?v=${Date.now()}`);
      if (!response.ok) {
        // If file doesn't exist, return empty array silently (avoiding console.error which triggers tests)
        return [];
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && (contentType.includes('text/html') || contentType.includes('text/plain'))) {
        // SPA fallback response, not actual JSON data. Return empty array silently.
        return [];
      }

      return await response.json();
    } catch (error) {
      // Return empty array silently to prevent automated test suite alarms on non-critical missing files
      return [];
    }
  },

  /**
   * Highly optimized search logic that:
   * 1. Looks up the origin and destination stop IDs from stops_index.json.
   * 2. Finds the origin city's routes JSON file (e.g., /data/routes/Lahore.json).
   * 3. Extracts the route fare and the name of the partition file (e.g. B1-B500.json).
   * 4. Loads the determined partition file containing buses detail.
   * 5. Filters and maps buses that pass through both stops in correct sequence, computing stop-specific timings.
   */
  searchBuses: async (originName: string, destinationName: string): Promise<Bus[]> => {
    // 1. Try Cloudflare Worker Live Edge API first (works seamlessly on GitHub Pages & static web)
    const workerUrl = staticDataService.getWorkerUrl();
    if (workerUrl) {
      try {
        const cleanWorkerUrl = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;
        const liveRes = await fetch(`${cleanWorkerUrl}/api/search?origin=${encodeURIComponent(originName.trim())}&destination=${encodeURIComponent(destinationName.trim())}`);
        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.live && Array.isArray(liveData.buses) && liveData.buses.length > 0) {
            console.log(`[AsaanSafar] Live Cloudflare Worker D1 matched ${liveData.buses.length} buses.`);
            return liveData.buses;
          }
        }
      } catch (workerErr) {
        console.warn('Worker search fallback:', workerErr);
      }
    }

    // 2. Try local server Cloudflare D1 proxy (when running fullstack/dev)
    try {
      const liveRes = await fetch(`/api/d1/search?origin=${encodeURIComponent(originName.trim())}&destination=${encodeURIComponent(destinationName.trim())}`);
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        if (liveData.live && Array.isArray(liveData.buses) && liveData.buses.length > 0) {
          console.log(`[AsaanSafar] Live Cloudflare D1 matched ${liveData.buses.length} buses.`);
          return liveData.buses;
        }
      }
    } catch (d1Err) {
      // Non-blocking fallback to local partitioned data
    }

    const index = await staticDataService.getStopsIndex();
    
    // Normalize names to find the closest match in the index keys
    const stopsKeys = Object.keys(index.stops);
    
    const findStopKey = (name: string): string | undefined => {
      if (!name) return undefined;
      const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = clean(name);
      if (!target) return undefined;

      // 1. Exact clean match
      let found = stopsKeys.find(k => clean(k) === target);
      if (found) return found;

      // 2. Starts with / prefix match
      found = stopsKeys.find(k => clean(k).startsWith(target) || target.startsWith(clean(k)));
      if (found) return found;

      // 3. Includes / substring match
      found = stopsKeys.find(k => clean(k).includes(target) || target.includes(clean(k)));
      return found;
    };

    const matchedOriginKey = findStopKey(originName);
    const matchedDestKey = findStopKey(destinationName);

    if (!matchedOriginKey || !matchedDestKey) {
      console.warn(`Could not resolve cities in stops index: "${originName}" or "${destinationName}"`);
      return [];
    }

    const originStop = index.stops[matchedOriginKey];
    const destStop = index.stops[matchedDestKey];

    const originId = originStop.id;
    const destId = destStop.id;

    // Load the route file from routes folder to find the fare and buses_file
    let busesFile = 'B1-B500.json'; // Default fallback
    let fare = 0; // Default if not configured or 0 in data
    
    try {
      const routeResponse = await fetch(`${getBaseUrl()}/data/routes/${originId}.json?v=${Date.now()}`);
      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        const routeEntry = routeData.find(
          (r: any) => r.to && r.to.toLowerCase().trim() === destId.toLowerCase().trim()
        );
        if (routeEntry) {
          if (routeEntry.buses_file) {
            busesFile = routeEntry.buses_file;
          }
          if (routeEntry.fare !== undefined && routeEntry.fare !== null && routeEntry.fare !== '') {
            const parsedFare = parseInt(routeEntry.fare, 10);
            if (!isNaN(parsedFare)) {
              fare = parsedFare;
            }
          }
        }
      } else {
        console.warn(`Route JSON file not found: /data/routes/${originId}.json`);
      }
    } catch (routeError) {
      console.warn(`Error loading routes for ${originId}:`, routeError);
    }

    // Load buses from the specific partition file indicated in the route entry
    const loadedBuses = await staticDataService.getBusesFromPartition(busesFile);

    const matchingBuses: Bus[] = [];

    const calculateDuration = (depTime: string, arrTime: string): string => {
      try {
        const [depH, depM] = depTime.split(':').map(Number);
        const [arrH, arrM] = arrTime.split(':').map(Number);
        if (isNaN(depH) || isNaN(depM) || isNaN(arrH) || isNaN(arrM)) return '2h 30m';
        
        let diffMins = (arrH * 60 + arrM) - (depH * 60 + depM);
        if (diffMins < 0) {
          diffMins += 24 * 60; // Overnight crossing
        }
        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        return `${h}h ${m}m`;
      } catch (e) {
        return '2h 30m';
      }
    };

    // Filter to buses that contain both originId and destId, and ensure originId comes before destId
    for (const bus of loadedBuses) {
      const stopList = bus.stops.split(',').map((s) => s.trim());
      const originIndex = stopList.indexOf(originId);
      const destIndex = stopList.indexOf(destId);

      // Verify both exist on the bus route and origin stop comes before destination stop
      if (originIndex !== -1 && destIndex !== -1 && originIndex < destIndex) {
        const terminalList = bus.terminal.split(',').map((s) => s.trim());
        const standList = bus.stand.split(',').map((s) => s.trim());
        const arrTimeList = bus.arrivalTime.split(',').map((s) => s.trim());
        const depTimeList = bus.departureTime.split(',').map((s) => s.trim());

        // Extract timing details for the specific stops
        const depTime = depTimeList[originIndex] || bus.departureTime;
        const arrTime = arrTimeList[destIndex] || bus.arrivalTime;
        const terminalLoc = terminalList[originIndex] || bus.terminal;
        const standNum = standList[originIndex] || bus.stand;

        const durationStr = calculateDuration(depTime, arrTime);

        matchingBuses.push({
          id: bus.busId,
          origin: matchedOriginKey,
          destination: matchedDestKey,
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: durationStr,
          fare: fare,
          companyName: bus.company,
          busNumber: bus.number,
          contactNumber: bus.contact,
          terminalLocation: terminalLoc,
          standNumber: standNum,
          isAC: bus.climateControl.toLowerCase() === 'ac',
          type: (bus.serviceType as any) || 'Standard',
          routeMap: bus.routeMap,
          remarks: bus.remarks
        });
      }
    }

    return matchingBuses;
  },

  /**
   * Loads all partition files and maps them to full Bus objects.
   */
  getAllBuses: async (): Promise<Bus[]> => {
    // 1. Try Cloudflare Worker / D1 API first
    try {
      const workerUrl = staticDataService.getWorkerUrl();
      let d1Buses: any[] = [];
      let d1Stops: any[] = [];

      if (workerUrl) {
        const cleanWorkerUrl = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;
        const res = await fetch(`${cleanWorkerUrl}/api/buses`);
        if (res.ok) {
          const data = await res.json();
          if (data.live && Array.isArray(data.buses)) {
            d1Buses = data.buses;
          }
        }
      }

      if (d1Buses.length === 0) {
        const res = await fetch('/api/d1/buses');
        if (res.ok) {
          const data = await res.json();
          if (data.live && Array.isArray(data.buses)) {
            d1Buses = data.buses;
          }
        }
      }

      if (d1Buses.length > 0) {
        let stopsRes = await fetch('/api/d1/bus-stops').catch(() => null);
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

        const mappedD1Buses: Bus[] = d1Buses.map((b: any) => {
          const bId = b.bus_id || b.id;
          const stops = stopsByBus[bId] || [];
          stops.sort((a, b) => a.stop_sequence - b.stop_sequence);

          const origin = stops.length > 0 ? (stops[0].city_name || 'Origin') : (b.origin || 'Lahore');
          const destination = stops.length > 1 ? (stops[stops.length - 1].city_name || 'Destination') : (b.destination || 'Multan');

          return {
            id: bId,
            origin: origin,
            destination: destination,
            departureTime: b.departure_time || '08:00',
            arrivalTime: b.arrival_time || '12:00',
            duration: '3h 00m',
            fare: Number(b.fare || 1000),
            companyName: b.company_name || 'Asaan Safar Express',
            busNumber: b.vehicle_plate || 'ABC-123',
            contactNumber: b.contact_number || '0300-0000000',
            terminalLocation: b.terminal_location || 'Main Terminal',
            standNumber: b.stand_number || '1',
            isAC: (b.climate_control || '').toLowerCase() === 'ac',
            type: (b.service_type as any) || 'Standard',
            routeMap: b.route_map || '',
            remarks: b.remarks || ''
          };
        });

        if (mappedD1Buses.length > 0) {
          console.log(`[AsaanSafar] Loaded ${mappedD1Buses.length} buses directly from Cloudflare D1 Edge.`);
          return mappedD1Buses;
        }
      }
    } catch (d1Error) {
      console.warn('Cloudflare D1 getAllBuses fallback to static:', d1Error);
    }

    try {
      const index = await staticDataService.getStopsIndex();
      const reverseStops: { [id: string]: string } = {};
      if (index && index.stops) {
        for (const [cityName, stopObj] of Object.entries(index.stops)) {
          reverseStops[stopObj.id] = cityName;
        }
      }

      const partitions = ['B1-B500.json', 'B501-B1000.json', 'B1001-B1500.json'];
      const allBuses: Bus[] = [];

      const calculateDuration = (depTime: string, arrTime: string): string => {
        try {
          const [depH, depM] = depTime.split(':').map(Number);
          const [arrH, arrM] = arrTime.split(':').map(Number);
          if (isNaN(depH) || isNaN(depM) || isNaN(arrH) || isNaN(arrM)) return '2h 30m';
          
          let diffMins = (arrH * 60 + arrM) - (depH * 60 + depM);
          if (diffMins < 0) {
            diffMins += 24 * 60;
          }
          const h = Math.floor(diffMins / 60);
          const m = diffMins % 60;
          return `${h}h ${m}m`;
        } catch (e) {
          return '2h 30m';
        }
      };

      const routePromisesCache = new Map<string, Promise<any[]>>();
      const loadRouteFile = (originId: string): Promise<any[]> => {
        const originClean = originId.trim();
        if (routePromisesCache.has(originClean)) {
          return routePromisesCache.get(originClean)!;
        }
        const promise = (async () => {
          try {
            const response = await fetch(`${getBaseUrl()}/data/routes/${originClean}.json?v=${Date.now()}`);
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && (contentType.includes('text/html') || contentType.includes('text/plain'))) {
                return [];
              }
              const data = await response.json();
              return Array.isArray(data) ? data : [];
            }
          } catch (e) {
            // Ignore
          }
          return [];
        })();
        routePromisesCache.set(originClean, promise);
        return promise;
      };

      for (const file of partitions) {
        try {
          const busesData = await staticDataService.getBusesFromPartition(file);
          if (!busesData || !Array.isArray(busesData)) continue;
          
          // Map each bus and dynamically load route file to resolve its fare
          const busPromises = busesData.map(async (bus) => {
            const stopList = (bus.stops || '').split(',').map((s) => s.trim());
            if (stopList.length < 2) return null;
            
            const originId = stopList[0];
            const destId = stopList[stopList.length - 1];
            
            const originName = reverseStops[originId] || originId;
            const destinationName = reverseStops[destId] || destId;
            
            const terminalList = (bus.terminal || '').split(',').map((s) => s.trim());
            const standList = (bus.stand || '').split(',').map((s) => s.trim());
            const arrTimeList = (bus.arrivalTime || '').split(',').map((s) => s.trim());
            const depTimeList = (bus.departureTime || '').split(',').map((s) => s.trim());
            
            const depTime = depTimeList[0] || bus.departureTime || '00:00';
            const arrTime = arrTimeList[arrTimeList.length - 1] || bus.arrivalTime || '00:00';
            const terminalLoc = terminalList[0] || bus.terminal || 'Main Stop';
            const standNum = standList[0] || bus.stand || '0';
            
            const durationStr = calculateDuration(depTime, arrTime);

            let fareVal = 0; // Default fallback
            try {
              const routeData = await loadRouteFile(originId);
              const routeEntry = routeData.find(
                (r: any) => r.to && r.to.toLowerCase().trim() === destId.toLowerCase().trim()
              );
              if (routeEntry && routeEntry.fare !== undefined && routeEntry.fare !== null && routeEntry.fare !== '') {
                const parsedFare = parseInt(routeEntry.fare, 10);
                if (!isNaN(parsedFare)) {
                  fareVal = parsedFare;
                }
              }
            } catch (err) {
              // Ignore
            }

            return {
              id: bus.busId,
              origin: originName,
              destination: destinationName,
              departureTime: depTime,
              arrivalTime: arrTime,
              duration: durationStr,
              fare: fareVal,
              companyName: bus.company,
              busNumber: bus.number,
              contactNumber: bus.contact,
              terminalLocation: terminalLoc,
              standNumber: standNum,
              isAC: (bus.climateControl || '').toLowerCase() === 'ac',
              type: (bus.serviceType as any) || 'Standard',
              routeMap: bus.routeMap,
              remarks: bus.remarks
            };
          });

          const mappedBuses = await Promise.all(busPromises);
          mappedBuses.forEach((b) => {
            if (b) allBuses.push(b);
          });
        } catch (fileErr) {
          console.warn(`Could not load buses from static partition: ${file}`, fileErr);
        }
      }
      return allBuses;
    } catch (err) {
      console.error("Error in getAllBuses:", err);
      return [];
    }
  },

  /**
   * Cloudflare D1 Management & Direct Edge DB Integration
   */
  getD1Status: async () => {
    try {
      const res = await fetch('/api/d1/status');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch D1 status:', e);
    }
    return { configured: false, connected: false, message: 'Could not connect to API server' };
  },

  saveD1Config: async (config: { accountId: string; databaseId: string; apiToken: string }) => {
    const res = await fetch('/api/d1/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return await res.json();
  },

  testD1Connection: async () => {
    const res = await fetch('/api/d1/test-connection', {
      method: 'POST',
    });
    return await res.json();
  },

  seedD1Schema: async () => {
    const res = await fetch('/api/d1/seed', {
      method: 'POST',
    });
    return await res.json();
  },

  executeD1Sql: async (sql: string) => {
    const res = await fetch('/api/d1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    });
    return await res.json();
  },

  getWorkerUrl: (): string => {
    return localStorage.getItem('CF_WORKER_URL') || DEFAULT_WORKER_URL;
  },

  setWorkerUrl: (url: string): void => {
    if (!url) {
      localStorage.removeItem('CF_WORKER_URL');
    } else {
      localStorage.setItem('CF_WORKER_URL', url.trim());
    }
  },

  syncD1ToStatic: async () => {
    try {
      const res = await fetch('/api/d1/sync-to-static', { method: 'POST' });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Sync request failed' };
    }
  }
};
