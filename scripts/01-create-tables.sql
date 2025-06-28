-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trains table
CREATE TABLE IF NOT EXISTS trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    train_number VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create train_routes table to store the route information for each train
CREATE TABLE IF NOT EXISTS train_routes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    distance_from_start INTEGER NOT NULL DEFAULT 0,
    departure_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(train_id, station_id),
    UNIQUE(train_id, sequence_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_train_routes_train_id ON train_routes(train_id);
CREATE INDEX IF NOT EXISTS idx_train_routes_station_id ON train_routes(station_id);
CREATE INDEX IF NOT EXISTS idx_train_routes_sequence ON train_routes(train_id, sequence_number);
