-- ====================================================================
-- ASAAN SAFAR - CLOUDFLARE D1 (SQLITE) OPTIMIZED DATABASE SCHEMA
-- This schema has been aligned EXACTLY with your Google Sheets columns
-- to allow seamless CSV imports and direct SQL queries.
-- ====================================================================

-- 1. Buses Table (Matches Sheet 1: "Buses Info")
CREATE TABLE IF NOT EXISTS buses (
    bus_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    vehicle_plate TEXT,
    contact_number TEXT,
    climate_control TEXT, -- e.g., 'Non-AC' or 'AC'
    service_type TEXT,    -- e.g., 'Standard' or 'Executive'
    route_map TEXT        -- Lahore -> Sheikhupura -> ...
);

-- Index for quick lookup of buses by company or climate control
CREATE INDEX IF NOT EXISTS idx_buses_company ON buses(company_name);


-- 2. Bus Stops Table (Matches Sheet 2: "Bus Stops / Schedules")
CREATE TABLE IF NOT EXISTS bus_stops (
    bus_id TEXT,
    city_name TEXT NOT NULL,
    stop_sequence INTEGER NOT NULL,
    arrival_time TEXT,    -- Store as TEXT (HH:MM)
    departure_time TEXT,  -- Store as TEXT (HH:MM)
    location TEXT,        -- e.g., 'Badami Bagh, LHR', 'Bypass'
    stand TEXT,           -- Store as TEXT to support values like "9" or "0"
    PRIMARY KEY (bus_id, city_name),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE
);

-- Index for instant route matching searches
CREATE INDEX IF NOT EXISTS idx_bus_stops_search 
ON bus_stops (city_name, stop_sequence);


-- 3. Fares Table (Matches Sheet 3: "Fares")
CREATE TABLE IF NOT EXISTS fares (
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    non_ac INTEGER DEFAULT 0,
    ac INTEGER DEFAULT 0,
    executive INTEGER DEFAULT 0,
    business INTEGER DEFAULT 0,
    sleeper INTEGER DEFAULT 0,
    PRIMARY KEY (origin, destination)
);

-- Index for rapid fare lookups between origin and destination
CREATE INDEX IF NOT EXISTS idx_fares_lookup 
ON fares (origin, destination);


-- ====================================================================
-- 📥 SEED DATA (Your Actual Google Sheet Data from B-10001 & B-10002)
-- Copy and paste the following SQL lines into your Cloudflare D1 Console!
-- ====================================================================

-- Seed buses:
INSERT OR REPLACE INTO buses (bus_id, company_name, vehicle_plate, contact_number, climate_control, service_type, route_map) VALUES
('B-10001', 'New Khan (Wahla Bros)', 'BSE-011', '0345-6816188', 'Non-AC', 'Standard', 'Lahore -> Sheikhupura -> Feroze Wattwan -> Manawala -> Shahkot -> Khurrianwala -> Faisalabad -> Shorkot -> Garh Moor -> Chowk Azam -> Fatehpur -> Karor'),
('B-10002', 'New Khan (Wahla Bros)', 'BSE-011', '0345-6816188', 'Non-AC', 'Standard', 'Karor -> Fatehpur -> Chowk Azam -> Garh Moor -> Shorkot -> Faisalabad -> Khurrianwala -> Shahkot -> Manawala -> Feroze Wattwan -> Sheikhupura -> Lahore'),
('B-10003', 'New Khan', 'BYE-257', '', 'Non-AC', 'Standard', 'Lahore -> Sheikhupura -> Feroze Wattwan -> Manawala -> Shahkot -> Khurrianwala -> Faisalabad -> Shorkot -> Garh Moor -> Chowk Azam -> Fatehpur -> Karor'),
('B-10004', 'New Khan', 'BYE-257', '', 'Non-AC', 'Standard', 'Karor -> Fatehpur -> Chowk Azam -> Garh Moor -> Shorkot -> Faisalabad -> Khurrianwala -> Shahkot -> Manawala -> Feroze Wattwan -> Sheikhupura -> Lahore'),
('B-10005', 'New Khan (Wahla Bros)', 'LES-267', '0300-4053019', 'Non-AC', 'Standard', 'Lahore -> Sheikhupura -> Feroze Wattwan -> Manawala -> Shahkot -> Khurrianwala -> Faisalabad -> Shorkot -> Garh Moor -> Chowk Azam -> Fatehpur -> Karor'),
('B-10006', 'New Khan (Wahla Bros)', 'LES-267', '0300-4053019', 'Non-AC', 'Standard', 'Karor -> Fatehpur -> Chowk Azam -> Garh Moor -> Shorkot -> Faisalabad -> Khurrianwala -> Shahkot -> Manawala -> Feroze Wattwan -> Sheikhupura -> Lahore');

-- Seed bus stops for B-10001 (Lahore to Karor sequence):
INSERT OR REPLACE INTO bus_stops (bus_id, city_name, stop_sequence, arrival_time, departure_time, location, stand) VALUES
('B-10001', 'Lahore', 1, '10:15', '13:30', 'Badami Bagh, LHR', '9'),
('B-10001', 'Sheikhupura', 2, '14:30', '14:30', 'Bypass', '0'),
('B-10001', 'Feroze Wattwan', 3, '15:00', '15:00', 'Main Stop', '0'),
('B-10001', 'Manawala', 4, '15:10', '15:10', 'Main Stop', '0'),
('B-10001', 'Shahkot', 5, '15:30', '15:30', 'Main Stop', '0'),
('B-10001', 'Khurrianwala', 6, '15:45', '15:45', 'Main Stop', '0'),
('B-10001', 'Faisalabad', 7, '16:15', '17:25', 'General Bus Stand, FSD', '0'),
('B-10001', 'Shorkot', 8, '20:00', '20:00', 'Main Stop', '0'),
('B-10001', 'Garh Moor', 9, '20:30', '20:30', 'Main Stop', '0'),
('B-10001', 'Chowk Azam', 10, '21:30', '21:30', 'Main Stop', '0'),
('B-10001', 'Fatehpur', 11, '22:00', '22:00', 'Bus Stand', '0'),
('B-10001', 'Karor', 12, '22:30', '02:30', 'Bus Stand', '0');

-- Seed bus stops for B-10002 (Karor to Lahore sequence):
INSERT OR REPLACE INTO bus_stops (bus_id, city_name, stop_sequence, arrival_time, departure_time, location, stand) VALUES
('B-10002', 'Karor', 1, '22:30', '02:30', 'Bus Stand', '0'),
('B-10002', 'Fatehpur', 2, '03:00', '03:00', 'Bus Stand', '0'),
('B-10002', 'Chowk Azam', 3, '03:30', '03:30', 'Main Stop', '0'),
('B-10002', 'Garh Moor', 4, '04:30', '04:30', 'Main Stop', '0'),
('B-10002', 'Shorkot', 5, '05:00', '05:00', 'Main Stop', '0');

-- Seed example fares (Origin -> Destination):
INSERT OR REPLACE INTO fares (origin, destination, non_ac, ac, executive, business, sleeper) VALUES
('Lahore', 'Sheikhupura', 150, 250, 350, 450, 600),
('Lahore', 'Feroze Wattwan', 250, 400, 500, 600, 800),
('Lahore', 'Manawala', 300, 450, 550, 700, 900),
('Lahore', 'Shahkot', 350, 500, 650, 800, 1000);

