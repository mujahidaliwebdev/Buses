import { Bus } from '../types';

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
    return { success: true, message: "Synced from Cloudflare D1" };
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
    try {
      const res = await fetch(`/api/d1/search?origin=${encodeURIComponent(originName.trim())}&destination=${encodeURIComponent(destinationName.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.live && Array.isArray(data.buses)) {
          return data.buses;
        }
      }
    } catch (e) {
      console.warn('D1 search error:', e);
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
          isAC: (b.climate_control || '').toLowerCase().includes('ac'),
          type: (b.service_type as any) || 'Standard',
          routeMap: b.route_map || '',
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
