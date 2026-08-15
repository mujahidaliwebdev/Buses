-- ====================================================================
-- ASAAN SAFAR - CLOUDFLARE D1 (SQLITE) OPTIMIZED DATABASE SCHEMA
-- Designed to minimize database Scans / Reads to prevent high billing.
-- ====================================================================

-- 1. Main Buses Table (Stores general bus details)
CREATE TABLE IF NOT EXISTS buses (
    bus_id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    number TEXT,
    contact TEXT,
    service_type TEXT DEFAULT 'Standard',
    climate_control TEXT DEFAULT 'Normal Ventilation',
    route_map TEXT
);

-- 2. Stops/Cities Index Table
CREATE TABLE IF NOT EXISTS stops (
    stop_id TEXT PRIMARY KEY,
    city_name TEXT NOT NULL UNIQUE
);

-- 3. Pre-defined Routes and Fares (1 Read per route lookup)
CREATE TABLE IF NOT EXISTS routes (
    origin_id TEXT,
    destination_id TEXT,
    fare INTEGER DEFAULT 1200,
    buses_file TEXT DEFAULT 'B1-B500.json',
    PRIMARY KEY (origin_id, destination_id),
    FOREIGN KEY (origin_id) REFERENCES stops(stop_id),
    FOREIGN KEY (destination_id) REFERENCES stops(stop_id)
);

-- Index for instant route fare/file lookup (1 Read)
CREATE INDEX IF NOT EXISTS idx_routes_search 
ON routes (origin_id, destination_id);


-- 4. Bus Stops Mapping (Junction Table for Sequence-based Search)
-- This table completely avoids "LIKE" text searches which cause full table scans.
CREATE TABLE IF NOT EXISTS bus_stops_mapping (
    bus_id TEXT,
    stop_id TEXT,
    stop_sequence INTEGER NOT NULL,
    terminal TEXT,
    stand TEXT,
    arrival_time TEXT,
    departure_time TEXT,
    PRIMARY KEY (bus_id, stop_id),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
    FOREIGN KEY (stop_id) REFERENCES stops(stop_id)
);

-- Crucial indexes to keep Reads equivalent to results count (e.g. 20 results = 20 Reads)
CREATE INDEX IF NOT EXISTS idx_bus_stops_lookup 
ON bus_stops_mapping (stop_id, stop_sequence);


-- ====================================================================
-- OPTIMIZED QUERY EXAMPLE:
-- Finding all buses going from S1 (Lahore) to S2 (Sheikhupura)
-- ====================================================================
-- SELECT 
--     b.bus_id,
--     b.company,
--     b.number,
--     b.contact,
--     b.service_type,
--     b.climate_control,
--     b.route_map,
--     s1.departure_time AS origin_departure,
--     s2.arrival_time AS destination_arrival,
--     s1.terminal AS origin_terminal,
--     s1.stand AS origin_stand,
--     r.fare
-- FROM bus_stops_mapping s1
-- JOIN bus_stops_mapping s2 ON s1.bus_id = s2.bus_id
-- JOIN buses b ON s1.bus_id = b.bus_id
-- LEFT JOIN routes r ON r.origin_id = s1.stop_id AND r.destination_id = s2.stop_id
-- WHERE s1.stop_id = 'S1'          -- Origin Stop ID
--   AND s2.stop_id = 'S2'          -- Destination Stop ID
--   AND s1.stop_sequence < s2.stop_sequence  -- Ensures correct direction
-- ORDER BY s1.departure_time ASC;
