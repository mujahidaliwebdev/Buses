import fs from 'fs';
import path from 'path';
import { queryD1 } from './d1';

/**
 * Synchronizes Cloudflare D1 live database records (buses, bus_stops, fares)
 * directly into the application's local public partition files (B1-B500.json and routes).
 * This ensures that static deployments (like GitHub Pages) are always 100% updated.
 */
export async function syncD1ToStaticData(): Promise<{ success: boolean; busCount: number; message: string }> {
  const publicDir = path.join(process.cwd(), 'public');
  const stopsIndexPath = path.join(publicDir, 'data', 'stops_index.json');

  if (!fs.existsSync(stopsIndexPath)) {
    return { success: false, busCount: 0, message: 'stops_index.json not found' };
  }

  const index = JSON.parse(fs.readFileSync(stopsIndexPath, 'utf-8'));
  const clean = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const stopNameToId: Record<string, string> = {};
  for (const [name, obj] of Object.entries((index as any).stops || {})) {
    stopNameToId[clean(name)] = (obj as any).id;
  }

  // Fetch all live records from Cloudflare D1
  const d1Buses = await queryD1('SELECT * FROM buses ORDER BY bus_id;');
  const d1Stops = await queryD1('SELECT * FROM bus_stops ORDER BY bus_id, stop_sequence;');
  const d1Fares = await queryD1('SELECT * FROM fares;');

  if (!d1Buses || d1Buses.length === 0) {
    return { success: true, busCount: 0, message: 'No buses found in D1 to sync.' };
  }

  const faresMap: Record<string, number> = {};
  for (const f of d1Fares) {
    const key = `${clean(f.origin)}_${clean(f.destination)}`;
    faresMap[key] = f.non_ac || f.ac || 0;
  }

  const stopsByBus: Record<string, any[]> = {};
  for (const s of d1Stops) {
    if (!stopsByBus[s.bus_id]) stopsByBus[s.bus_id] = [];
    stopsByBus[s.bus_id].push(s);
  }

  const generatedBuses: any[] = [];
  for (const b of d1Buses) {
    const stopsList = stopsByBus[b.bus_id] || [];
    const stopIds = stopsList.map((s) => stopNameToId[clean(s.city_name)] || s.city_name);
    const terminalList = stopsList.map((s) => s.location || 'Main Stop');
    const standList = stopsList.map((s) => s.stand || '0');
    const arrTimeList = stopsList.map((s) => s.arrival_time || '00:00');
    const depTimeList = stopsList.map((s) => s.departure_time || s.arrival_time || '00:00');

    generatedBuses.push({
      busId: b.bus_id,
      company: b.company_name,
      number: b.vehicle_plate,
      contact: b.contact_number,
      serviceType: b.service_type || 'Standard',
      climateControl: b.climate_control || 'Normal Ventilation',
      stops: stopIds.join(', '),
      terminal: terminalList.join(', '),
      stand: standList.join(', '),
      arrivalTime: arrTimeList.join(', '),
      departureTime: depTimeList.join(', '),
      routeMap: b.route_map || '',
    });
  }

  const updatePartitionFile = (filePath: string) => {
    if (!fs.existsSync(filePath)) return;
    try {
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const combinedMap = new Map<string, any>();
      for (const eb of existing) combinedMap.set(eb.busId, eb);
      for (const gb of generatedBuses) combinedMap.set(gb.busId, gb);
      const finalBuses = Array.from(combinedMap.values());
      fs.writeFileSync(filePath, JSON.stringify(finalBuses, null, 2), 'utf-8');
    } catch (e) {
      console.warn(`Failed to update ${filePath}:`, e);
    }
  };

  // Update in public/ and dist/
  updatePartitionFile(path.join(publicDir, 'data', 'buses', 'B1-B500.json'));
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    updatePartitionFile(path.join(distDir, 'data', 'buses', 'B1-B500.json'));
  }

  // Ensure route files in routes/ have entries for all pairs in each bus
  const updateRoutes = (baseRoutesDir: string) => {
    if (!fs.existsSync(baseRoutesDir)) return;
    for (const b of generatedBuses) {
      const stopsList = stopsByBus[b.busId] || [];
      for (let i = 0; i < stopsList.length; i++) {
        const origStop = stopsList[i];
        const origId = stopNameToId[clean(origStop.city_name)];
        if (!origId) continue;

        const routeFilePath = path.join(baseRoutesDir, `${origId}.json`);
        let routeData: any[] = [];
        if (fs.existsSync(routeFilePath)) {
          try {
            routeData = JSON.parse(fs.readFileSync(routeFilePath, 'utf-8'));
          } catch {
            routeData = [];
          }
        }

        let routeModified = false;
        for (let j = i + 1; j < stopsList.length; j++) {
          const destStop = stopsList[j];
          const destId = stopNameToId[clean(destStop.city_name)];
          if (!destId) continue;

          const fareKey = `${clean(origStop.city_name)}_${clean(destStop.city_name)}`;
          const fareVal = faresMap[fareKey] !== undefined ? String(faresMap[fareKey]) : '0';

          const existingEntryIndex = routeData.findIndex(
            (r: any) => r.to && r.to.toLowerCase() === destId.toLowerCase()
          );
          if (existingEntryIndex >= 0) {
            if (
              routeData[existingEntryIndex].buses_file !== 'B1-B500.json' ||
              routeData[existingEntryIndex].fare !== fareVal
            ) {
              routeData[existingEntryIndex].buses_file = 'B1-B500.json';
              routeData[existingEntryIndex].fare = fareVal;
              routeModified = true;
            }
          } else {
            routeData.push({
              to: destId,
              fare: fareVal,
              buses_file: 'B1-B500.json',
            });
            routeModified = true;
          }
        }

        if (routeModified) {
          fs.writeFileSync(routeFilePath, JSON.stringify(routeData, null, 2), 'utf-8');
        }
      }
    }
  };

  updateRoutes(path.join(publicDir, 'data', 'routes'));
  if (fs.existsSync(distDir)) {
    updateRoutes(path.join(distDir, 'data', 'routes'));
  }

  return {
    success: true,
    busCount: generatedBuses.length,
    message: `Successfully synchronized ${generatedBuses.length} buses from Cloudflare D1 into local partitions.`,
  };
}
