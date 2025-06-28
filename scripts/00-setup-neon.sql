-- Neon Database Setup Script
-- Run this first to set up your database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stations table with enhanced structure
DROP TABLE IF EXISTS train_routes CASCADE;
DROP TABLE IF EXISTS trains CASCADE;
DROP TABLE IF EXISTS stations CASCADE;

CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    state VARCHAR(50),
    zone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trains table with enhanced structure
CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    train_number VARCHAR(20) NOT NULL UNIQUE,
    train_type VARCHAR(50) DEFAULT 'Express',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create train_routes table with enhanced structure
CREATE TABLE train_routes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    distance_from_start INTEGER NOT NULL DEFAULT 0,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    halt_duration INTEGER DEFAULT 2, -- in minutes
    platform_number VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(train_id, station_id),
    UNIQUE(train_id, sequence_number)
);

-- Create indexes for better performance
CREATE INDEX idx_stations_code ON stations(code);
CREATE INDEX idx_stations_name ON stations(name);
CREATE INDEX idx_stations_active ON stations(is_active);

CREATE INDEX idx_trains_number ON trains(train_number);
CREATE INDEX idx_trains_active ON trains(is_active);

CREATE INDEX idx_train_routes_train_id ON train_routes(train_id);
CREATE INDEX idx_train_routes_station_id ON train_routes(station_id);
CREATE INDEX idx_train_routes_sequence ON train_routes(train_id, sequence_number);
CREATE INDEX idx_train_routes_active ON train_routes(is_active);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trains_updated_at BEFORE UPDATE ON trains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
