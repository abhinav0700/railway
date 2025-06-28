-- Insert sample trains with realistic data
INSERT INTO trains (name, train_number, train_type) VALUES 
-- Rajdhani Trains
('New Delhi Rajdhani Express', '12301', 'Rajdhani'),
('Mumbai Rajdhani Express', '12951', 'Rajdhani'),
('Chennai Rajdhani Express', '12433', 'Rajdhani'),
('Bangalore Rajdhani Express', '12429', 'Rajdhani'),

-- Shatabdi Trains
('New Delhi Shatabdi Express', '12001', 'Shatabdi'),
('Mumbai Shatabdi Express', '12027', 'Shatabdi'),
('Chennai Shatabdi Express', '12007', 'Shatabdi'),

-- Duronto Trains
('Mumbai Duronto Express', '12259', 'Duronto'),
('Chennai Duronto Express', '12245', 'Duronto'),
('Bangalore Duronto Express', '12273', 'Duronto'),

-- Express Trains
('Grand Trunk Express', '12615', 'Express'),
('Coromandel Express', '12841', 'Express'),
('Gitanjali Express', '12859', 'Express'),
('Karnataka Express', '12627', 'Express'),
('Tamil Nadu Express', '12621', 'Express'),

-- Mail Trains
('Howrah Mail', '12809', 'Mail'),
('Chennai Mail', '12163', 'Mail'),
('Mumbai Mail', '12137', 'Mail'),

-- Superfast Trains
('Rajdhani Superfast', '12423', 'Superfast'),
('Shatabdi Superfast', '12034', 'Superfast'),
('Express Superfast', '12456', 'Superfast')

ON CONFLICT (train_number) DO NOTHING;
