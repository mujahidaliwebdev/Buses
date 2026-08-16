-- ====================================================================
-- ASAAN SAFAR - CLOUDFLARE D1 (SQLITE) OPTIMIZED DATABASE SCHEMA
-- Direct City Names used instead of Stop IDs to minimize database Reads.
-- ====================================================================

-- 1. Buses Table (Stores general bus profile details - 1 entry per bus)
CREATE TABLE IF NOT EXISTS buses (
    bus_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    vehicle_number TEXT,
    contact_number TEXT,
    service_type TEXT DEFAULT 'Standard',
    climate_control TEXT DEFAULT 'Normal'
);

-- 2. Bus Stops Table (Stores sequential stops with city names directly)
CREATE TABLE IF NOT EXISTS bus_stops (
    bus_id TEXT,
    city_name TEXT NOT NULL,
    stop_sequence INTEGER NOT NULL,
    arrival_time TEXT,
    departure_time TEXT,
    terminal_location TEXT,
    stand_number TEXT,
    PRIMARY KEY (bus_id, city_name),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);

-- Index for instant search using direct city names
CREATE INDEX IF NOT EXISTS idx_bus_stops_city_search 
ON bus_stops (city_name, stop_sequence);


-- 3. Direct Route Fares Table (Stores category-wise ticket fares directly between cities)
CREATE TABLE IF NOT EXISTS route_fares (
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    fare_non_ac INTEGER DEFAULT 0,
    fare_ac INTEGER DEFAULT 0,
    fare_executive INTEGER DEFAULT 0,
    fare_business INTEGER DEFAULT 0,
    fare_sleeper INTEGER DEFAULT 0,
    PRIMARY KEY (origin_city, destination_city)
);

-- Index for instant fare lookup between origin and destination
CREATE INDEX IF NOT EXISTS idx_route_fares_lookup 
ON route_fares (origin_city, destination_city);
