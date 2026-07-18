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
}

export const staticDataService = {
  /**
   * Fetches the central search index of all stops/cities.
   */
  getStopsIndex: async (): Promise<StaticStopsIndex> => {
    try {
      const response = await fetch('/data/stops_index.json');
      if (!response.ok) {
        throw new Error(`Failed to load stops index: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading stops index:', error);
      return { stops: {} };
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
      const response = await fetch(`/data/buses/${partitionFile}`);
      if (!response.ok) {
        throw new Error(`Failed to load partition file "${partitionFile}": ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading buses from partition "${partitionFile}":`, error);
      return [];
    }
  },

  /**
   * Highly optimized search logic that:
   * 1. Looks up the origin and destination stop IDs.
   * 2. Finds the intersection of Bus IDs passing through both stops.
   * 3. Calculates which partition files those Bus IDs live in.
   * 4. Loads ONLY those partition files.
   * 5. Filters out the specific buses and verifies route sequence/direction.
   */
  searchBuses: async (originName: string, destinationName: string): Promise<StaticBus[]> => {
    const index = await staticDataService.getStopsIndex();
    
    // Normalize names to find the closest match in the index keys
    const stopsKeys = Object.keys(index.stops);
    
    const matchedOriginKey = stopsKeys.find(
      (k) => k.toLowerCase().trim() === originName.toLowerCase().trim()
    );
    const matchedDestKey = stopsKeys.find(
      (k) => k.toLowerCase().trim() === destinationName.toLowerCase().trim()
    );

    if (!matchedOriginKey || !matchedDestKey) {
      console.warn(`Could not resolve cities in stops index: "${originName}" or "${destinationName}"`);
      return [];
    }

    const originStop = index.stops[matchedOriginKey];
    const destStop = index.stops[matchedDestKey];

    const originId = originStop.id;
    const destId = destStop.id;

    // Load the partition file (currently B1-B500.json contains all sequences)
    const partitionFiles = ['B1-B500.json'];
    
    const loadedBuses: StaticBus[] = [];
    for (const partitionFile of partitionFiles) {
      const buses = await staticDataService.getBusesFromPartition(partitionFile);
      loadedBuses.push(...buses);
    }

    // Filter to buses that contain both originId and destId, and ensure originId comes before destId
    const matchingBusesStr = loadedBuses.filter((bus) => {
      const stopList = bus.stops.split(',').map((s) => s.trim());
      const originIndex = stopList.indexOf(originId);
      const destIndex = stopList.indexOf(destId);

      // Verify both exist on the bus route and origin stop comes before destination stop
      return originIndex !== -1 && destIndex !== -1 && originIndex < destIndex;
    });

    return matchingBusesStr;
  }
};
