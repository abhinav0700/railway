-- Sample train routes for testing
-- Route 1: New Delhi to Mumbai (Rajdhani)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time) VALUES 
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '16:55', '16:55'),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'GWL'), 2, 319, '20:03', '20:05'),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'JHS'), 3, 415, '21:28', '21:30'),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'BPL'), 4, 707, '01:15', '01:20'),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'NGP'), 5, 1061, '05:25', '05:35'),
((SELECT id FROM trains WHERE train_number = '12301'), (SELECT id FROM stations WHERE code = 'MMCT'), 6, 1384, '08:35', '08:35')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Route 2: Chennai to Bangalore (Express)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time) VALUES 
((SELECT id FROM trains WHERE train_number = '12615'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '13:40', '13:40'),
((SELECT id FROM trains WHERE train_number = '12615'), (SELECT id FROM stations WHERE code = 'CBE'), 2, 496, '20:15', '20:20'),
((SELECT id FROM trains WHERE train_number = '12615'), (SELECT id FROM stations WHERE code = 'SBC'), 3, 362, '23:15', '23:15')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Route 3: Mumbai to Chennai (Coromandel Express)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time) VALUES 
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '14:15', '14:15'),
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'PUNE'), 2, 192, '17:25', '17:30'),
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'SBC'), 3, 981, '06:30', '06:40'),
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'MAS'), 4, 1279, '11:45', '11:45')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Route 4: Delhi to Kolkata (Howrah Mail)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time) VALUES 
((SELECT id FROM trains WHERE train_number = '12809'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '22:05', '22:05'),
((SELECT id FROM trains WHERE train_number = '12809'), (SELECT id FROM stations WHERE code = 'CNB'), 2, 441, '03:40', '03:45'),
((SELECT id FROM trains WHERE train_number = '12809'), (SELECT id FROM stations WHERE code = 'ALD'), 3, 634, '06:28', '06:33'),
((SELECT id FROM trains WHERE train_number = '12809'), (SELECT id FROM stations WHERE code = 'PNBE'), 4, 984, '11:30', '11:40'),
((SELECT id FROM trains WHERE train_number = '12809'), (SELECT id FROM stations WHERE code = 'HWH'), 5, 1441, '17:20', '17:20')
ON CONFLICT (train_id, station_id) DO NOTHING;

-- Route 5: Bangalore to Mysore (Local connection)
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time) VALUES 
((SELECT id FROM trains WHERE train_number = '12456'), (SELECT id FROM stations WHERE code = 'SBC'), 1, 0, '06:15', '06:15'),
((SELECT id FROM trains WHERE train_number = '12456'), (SELECT id FROM stations WHERE code = 'MYS'), 2, 139, '09:00', '09:00')
ON CONFLICT (train_id, station_id) DO NOTHING;
