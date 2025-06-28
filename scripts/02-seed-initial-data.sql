-- Insert sample stations
INSERT INTO stations (name, code) VALUES 
('Chennai', 'CHN'),
('Vellore', 'VLR'),
('Bangalore', 'BLR'),
('Mysuru', 'MYS'),
('Mangalore', 'MNG'),
('Shimoga', 'SHM'),
('Coimbatore', 'CBE'),
('Salem', 'SLM'),
('Tirupur', 'TUP'),
('Erode', 'ERD')
ON CONFLICT (code) DO NOTHING;

-- Insert sample trains
INSERT INTO trains (name, train_number) VALUES 
('Chennai Express', 'CE001'),
('Bangalore Mail', 'BM002'),
('Coastal Express', 'COE003')
ON CONFLICT (train_number) DO NOTHING;

-- Insert train routes for Chennai Express (Train A from example)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time) VALUES 
((SELECT id FROM trains WHERE train_number = 'CE001'), (SELECT id FROM stations WHERE code = 'CHN'), 1, 0, '09:00'),
((SELECT id FROM trains WHERE train_number = 'CE001'), (SELECT id FROM stations WHERE code = 'VLR'), 2, 170, '11:00'),
((SELECT id FROM trains WHERE train_number = 'CE001'), (SELECT id FROM stations WHERE code = 'BLR'), 3, 370, '15:30'),
((SELECT id FROM trains WHERE train_number = 'CE001'), (SELECT id FROM stations WHERE code = 'MYS'), 4, 490, '17:30'),
((SELECT id FROM trains WHERE train_number = 'CE001'), (SELECT id FROM stations WHERE code = 'MNG'), 5, 790, '21:45')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Insert train routes for Bangalore Mail (Train B from example)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time) VALUES 
((SELECT id FROM trains WHERE train_number = 'BM002'), (SELECT id FROM stations WHERE code = 'BLR'), 1, 0, '09:00'),
((SELECT id FROM trains WHERE train_number = 'BM002'), (SELECT id FROM stations WHERE code = 'SHM'), 2, 180, '12:00'),
((SELECT id FROM trains WHERE train_number = 'BM002'), (SELECT id FROM stations WHERE code = 'MNG'), 3, 430, '17:30')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Insert train routes for Coastal Express (Train C from example)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time) VALUES 
((SELECT id FROM trains WHERE train_number = 'COE003'), (SELECT id FROM stations WHERE code = 'BLR'), 1, 0, '16:00'),
((SELECT id FROM trains WHERE train_number = 'COE003'), (SELECT id FROM stations WHERE code = 'SHM'), 2, 180, '19:00'),
((SELECT id FROM trains WHERE train_number = 'COE003'), (SELECT id FROM stations WHERE code = 'MNG'), 3, 430, '23:45')
ON CONFLICT (train_id, station_id) DO NOTHING;
