-- Enhanced train routes with multiple trains per route and dynamic pricing
-- Clear existing data first
TRUNCATE TABLE train_routes CASCADE;
TRUNCATE TABLE trains CASCADE;

-- Insert comprehensive train data with multiple trains per popular route
INSERT INTO trains (name, train_number, train_type) VALUES 
-- Delhi to Mumbai Route (10 trains)
('Rajdhani Express', '12951', 'Rajdhani'),
('August Kranti Rajdhani', '12953', 'Rajdhani'),
('Mumbai Rajdhani Express', '12955', 'Rajdhani'),
('Golden Temple Mail', '12903', 'Mail'),
('Punjab Mail', '12137', 'Mail'),
('Frontier Mail', '12175', 'Mail'),
('Paschim Express', '12925', 'Express'),
('Swaraj Express', '12471', 'Express'),
('Delhi Sarai Rohilla Express', '14707', 'Express'),
('Kutch Express', '19115', 'Express'),

-- Mumbai to Chennai Route (10 trains)
('Chennai Express', '12163', 'Express'),
('Coromandel Express', '12841', 'Express'),
('Chennai Mail', '12615', 'Mail'),
('Dadar Express', '11013', 'Express'),
('Mumbai Chennai Express', '12621', 'Express'),
('Navjeevan Express', '12655', 'Express'),
('West Coast Express', '16345', 'Express'),
('Konkan Kanya Express', '10111', 'Express'),
('Mumbai CST Chennai Express', '12701', 'Express'),
('Chalukya Express', '12785', 'Express'),

-- Delhi to Chennai Route (10 trains)
('Tamil Nadu Express', '12621', 'Express'),
('Grand Trunk Express', '12615', 'Express'),
('Chennai Rajdhani', '12433', 'Rajdhani'),
('Sampark Kranti Express', '12283', 'Express'),
('Delhi Chennai Express', '12615', 'Express'),
('Southern Express', '12601', 'Express'),
('Nilgiri Express', '12671', 'Express'),
('Pandian Express', '12617', 'Express'),
('Rock Fort Express', '12665', 'Express'),
('Cheran Express', '12673', 'Express'),

-- Mumbai to Bangalore Route (10 trains)
('Udyan Express', '11301', 'Express'),
('Chalukya Express', '11139', 'Express'),
('Bangalore Express', '16529', 'Express'),
('Rani Chennamma Express', '11035', 'Express'),
('Mahamana Express', '12621', 'Express'),
('Karnataka Express', '12627', 'Express'),
('Bangalore Rajdhani', '12429', 'Rajdhani'),
('Hubli Express', '17301', 'Express'),
('Gol Gumbaz Express', '17319', 'Express'),
('Hampi Express', '16591', 'Express'),

-- Delhi to Kolkata Route (10 trains)
('Howrah Rajdhani', '12301', 'Rajdhani'),
('Sealdah Rajdhani', '12313', 'Rajdhani'),
('Howrah Mail', '12809', 'Mail'),
('Kalka Mail', '12311', 'Mail'),
('Poorva Express', '12303', 'Express'),
('Coalfield Express', '13007', 'Express'),
('Sampoorna Kranti Express', '12285', 'Express'),
('Doon Express', '13009', 'Express'),
('Brahmaputra Mail', '12423', 'Mail'),
('Ganga Kaveri Express', '16317', 'Express'),

-- Chennai to Bangalore Route (10 trains)
('Shatabdi Express', '12007', 'Shatabdi'),
('Bangalore Express', '12639', 'Express'),
('Lalbagh Express', '12607', 'Express'),
('Kaveri Express', '16021', 'Express'),
('Brindavan Express', '12639', 'Express'),
('Mysore Express', '16231', 'Express'),
('Chamundi Express', '16215', 'Express'),
('Tippu Express', '16219', 'Express'),
('Karnataka Express', '12628', 'Express'),
('Bangalore Mail', '12608', 'Mail'),

-- Additional popular routes
('Goa Express', '12779', 'Express'),
('Konkan Railway Express', '10103', 'Express'),
('Mandovi Express', '10103', 'Express'),
('Netravati Express', '16345', 'Express'),
('Matsyagandha Express', '12619', 'Express'),
('Jan Shatabdi Express', '12081', 'Jan Shatabdi'),
('Intercity Express', '12625', 'Intercity'),
('Passenger Train', '56789', 'Passenger'),
('Local Express', '59440', 'Passenger'),
('Regional Express', '18464', 'Express')

ON CONFLICT (train_number) DO NOTHING;

-- Insert comprehensive route data with realistic timings and distances
-- Delhi to Mumbai routes
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time, halt_duration) VALUES 
-- Rajdhani Express (12951)
((SELECT id FROM trains WHERE train_number = '12951'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '16:55', '16:55', 0),
((SELECT id FROM trains WHERE train_number = '12951'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '08:35', '08:35', 0),

-- August Kranti Rajdhani (12953)
((SELECT id FROM trains WHERE train_number = '12953'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '17:55', '17:55', 0),
((SELECT id FROM trains WHERE train_number = '12953'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '09:35', '09:35', 0),

-- Mumbai Rajdhani Express (12955)
((SELECT id FROM trains WHERE train_number = '12955'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '16:00', '16:00', 0),
((SELECT id FROM trains WHERE train_number = '12955'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '08:00', '08:00', 0),

-- Golden Temple Mail (12903)
((SELECT id FROM trains WHERE train_number = '12903'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '22:30', '22:30', 0),
((SELECT id FROM trains WHERE train_number = '12903'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '16:45', '16:45', 0),

-- Punjab Mail (12137)
((SELECT id FROM trains WHERE train_number = '12137'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '23:45', '23:45', 0),
((SELECT id FROM trains WHERE train_number = '12137'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '18:30', '18:30', 0),

-- Frontier Mail (12175)
((SELECT id FROM trains WHERE train_number = '12175'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '14:20', '14:20', 0),
((SELECT id FROM trains WHERE train_number = '12175'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '07:50', '07:50', 0),

-- Paschim Express (12925)
((SELECT id FROM trains WHERE train_number = '12925'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '15:15', '15:15', 0),
((SELECT id FROM trains WHERE train_number = '12925'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '10:30', '10:30', 0),

-- Swaraj Express (12471)
((SELECT id FROM trains WHERE train_number = '12471'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '06:25', '06:25', 0),
((SELECT id FROM trains WHERE train_number = '12471'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '23:45', '23:45', 0),

-- Delhi Sarai Rohilla Express (14707)
((SELECT id FROM trains WHERE train_number = '14707'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '11:50', '11:50', 0),
((SELECT id FROM trains WHERE train_number = '14707'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '06:15', '06:15', 0),

-- Kutch Express (19115)
((SELECT id FROM trains WHERE train_number = '19115'), (SELECT id FROM stations WHERE code = 'NDLS'), 1, 0, '23:20', '23:20', 0),
((SELECT id FROM trains WHERE train_number = '19115'), (SELECT id FROM stations WHERE code = 'MMCT'), 2, 1384, '22:30', '22:30', 0)

ON CONFLICT (train_id, station_id) DO NOTHING;

-- Mumbai to Chennai routes
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time, halt_duration) VALUES 
-- Chennai Express (12163)
((SELECT id FROM trains WHERE train_number = '12163'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '11:40', '11:40', 0),
((SELECT id FROM trains WHERE train_number = '12163'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '19:15', '19:15', 0),

-- Coromandel Express (12841)
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '14:15', '14:15', 0),
((SELECT id FROM trains WHERE train_number = '12841'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '11:45', '11:45', 0),

-- Chennai Mail (12615)
((SELECT id FROM trains WHERE train_number = '12615'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '20:05', '20:05', 0),
((SELECT id FROM trains WHERE train_number = '12615'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '04:30', '04:30', 0),

-- Dadar Express (11013)
((SELECT id FROM trains WHERE train_number = '11013'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '07:15', '07:15', 0),
((SELECT id FROM trains WHERE train_number = '11013'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '08:45', '08:45', 0),

-- Mumbai Chennai Express (12621)
((SELECT id FROM trains WHERE train_number = '12621'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '22:20', '22:20', 0),
((SELECT id FROM trains WHERE train_number = '12621'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '05:40', '05:40', 0),

-- Navjeevan Express (12655)
((SELECT id FROM trains WHERE train_number = '12655'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '21:50', '21:50', 0),
((SELECT id FROM trains WHERE train_number = '12655'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '06:30', '06:30', 0),

-- West Coast Express (16345)
((SELECT id FROM trains WHERE train_number = '16345'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '10:30', '10:30', 0),
((SELECT id FROM trains WHERE train_number = '16345'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '14:15', '14:15', 0),

-- Konkan Kanya Express (10111)
((SELECT id FROM trains WHERE train_number = '10111'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '05:40', '05:40', 0),
((SELECT id FROM trains WHERE train_number = '10111'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '12:20', '12:20', 0),

-- Mumbai CST Chennai Express (12701)
((SELECT id FROM trains WHERE train_number = '12701'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '16:45', '16:45', 0),
((SELECT id FROM trains WHERE train_number = '12701'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '22:30', '22:30', 0),

-- Chalukya Express (12785)
((SELECT id FROM trains WHERE train_number = '12785'), (SELECT id FROM stations WHERE code = 'MMCT'), 1, 0, '17:35', '17:35', 0),
((SELECT id FROM trains WHERE train_number = '12785'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 1279, '23:45', '23:45', 0)

ON CONFLICT (train_id, station_id) DO NOTHING;

-- Chennai to Bangalore routes
INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time, arrival_time, halt_duration) VALUES 
-- Shatabdi Express (12007)
((SELECT id FROM trains WHERE train_number = '12007'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '06:00', '06:00', 0),
((SELECT id FROM trains WHERE train_number = '12007'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '11:30', '11:30', 0),

-- Bangalore Express (12639)
((SELECT id FROM trains WHERE train_number = '12639'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '13:40', '13:40', 0),
((SELECT id FROM trains WHERE train_number = '12639'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '20:15', '20:15', 0),

-- Lalbagh Express (12607)
((SELECT id FROM trains WHERE train_number = '12607'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '22:50', '22:50', 0),
((SELECT id FROM trains WHERE train_number = '12607'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '05:30', '05:30', 0),

-- Kaveri Express (16021)
((SELECT id FROM trains WHERE train_number = '16021'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '20:30', '20:30', 0),
((SELECT id FROM trains WHERE train_number = '16021'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '03:15', '03:15', 0),

-- Brindavan Express (12639)
((SELECT id FROM trains WHERE train_number = '12640'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '07:50', '07:50', 0),
((SELECT id FROM trains WHERE train_number = '12640'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '14:30', '14:30', 0),

-- Mysore Express (16231)
((SELECT id FROM trains WHERE train_number = '16231'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '15:20', '15:20', 0),
((SELECT id FROM trains WHERE train_number = '16231'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '22:45', '22:45', 0),

-- Chamundi Express (16215)
((SELECT id FROM trains WHERE train_number = '16215'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '23:30', '23:30', 0),
((SELECT id FROM trains WHERE train_number = '16215'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '06:15', '06:15', 0),

-- Tippu Express (16219)
((SELECT id FROM trains WHERE train_number = '16219'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '14:45', '14:45', 0),
((SELECT id FROM trains WHERE train_number = '16219'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '21:30', '21:30', 0),

-- Karnataka Express (12628)
((SELECT id FROM trains WHERE train_number = '12628'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '21:15', '21:15', 0),
((SELECT id FROM trains WHERE train_number = '12628'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '04:00', '04:00', 0),

-- Bangalore Mail (12608)
((SELECT id FROM trains WHERE train_number = '12608'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 0, '19:45', '19:45', 0),
((SELECT id FROM trains WHERE train_number = '12608'), (SELECT id FROM stations WHERE code = 'SBC'), 2, 362, '02:30', '02:30', 0)

ON CONFLICT (train_id, station_id) DO NOTHING;
