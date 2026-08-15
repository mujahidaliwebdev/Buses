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
    climate_control TEXT DEFAULT 'Normal Ventilation'
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


-- 3. Direct Route Fares Table (Stores ticket fare directly between cities)
CREATE TABLE IF NOT EXISTS route_fares (
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    fare INTEGER DEFAULT 1200,
    PRIMARY KEY (origin_city, destination_city)
);

-- Index for instant fare lookup between origin and destination
CREATE INDEX IF NOT EXISTS idx_route_fares_lookup 
ON route_fares (origin_city, destination_city);


-- ====================================================================
-- OPTIMIZED SINGLE-QUERY SEARCH EXAMPLE:
-- Finding all buses going from 'Lahore' to 'Faisalabad'
-- ====================================================================
-- SELECT 
--     b.bus_id,
--     b.company_name,
--     b.vehicle_number,
--     b.contact_number,
--     b.service_type,
--     b.climate_control,
--     s1.departure_time AS origin_departure,
--     s2.arrival_time AS destination_arrival,
--     s1.terminal_location AS origin_terminal,
--     s1.stand_number AS origin_stand,
--     f.fare
-- FROM bus_stops s1
-- JOIN bus_stops s2 ON s1.bus_id = s2.bus_id
-- JOIN buses b ON s1.bus_id = b.bus_id
-- LEFT JOIN route_fares f ON f.origin_city = s1.city_name AND f.destination_city = s2.city_name
-- WHERE s1.city_name = 'Lahore'
--   AND s2.city_name = 'Faisalabad'
--   AND s1.stop_sequence < s2.stop_sequence  -- Ensures correct direction
-- ORDER BY s1.departure_time ASC;
