-- Insert major Indian railway stations
INSERT INTO stations (name, code, state, zone) VALUES 
-- Metro Cities
('New Delhi', 'NDLS', 'Delhi', 'NR'),
('Mumbai Central', 'MMCT', 'Maharashtra', 'WR'),
('Chennai Central', 'MAS', 'Tamil Nadu', 'SR'),
('Howrah Junction', 'HWH', 'West Bengal', 'ER'),
('Bangalore City', 'SBC', 'Karnataka', 'SWR'),
('Hyderabad Deccan', 'HYB', 'Telangana', 'SCR'),

-- Major Junction Stations
('Allahabad Junction', 'ALD', 'Uttar Pradesh', 'NCR'),
('Kanpur Central', 'CNB', 'Uttar Pradesh', 'NCR'),
('Lucknow', 'LKO', 'Uttar Pradesh', 'NER'),
('Patna Junction', 'PNBE', 'Bihar', 'ECR'),
('Guwahati', 'GHY', 'Assam', 'NFR'),
('Bhubaneswar', 'BBS', 'Odisha', 'ECoR'),

-- Important Commercial Centers
('Pune Junction', 'PUNE', 'Maharashtra', 'CR'),
('Ahmedabad Junction', 'ADI', 'Gujarat', 'WR'),
('Surat', 'ST', 'Gujarat', 'WR'),
('Indore Junction', 'INDB', 'Madhya Pradesh', 'WCR'),
('Bhopal Junction', 'BPL', 'Madhya Pradesh', 'WCR'),
('Nagpur Junction', 'NGP', 'Maharashtra', 'CR'),

-- South Indian Stations
('Coimbatore Junction', 'CBE', 'Tamil Nadu', 'SR'),
('Madurai Junction', 'MDU', 'Tamil Nadu', 'SR'),
('Thiruvananthapuram Central', 'TVC', 'Kerala', 'SR'),
('Kochi Central', 'ERS', 'Kerala', 'SR'),
('Mysore Junction', 'MYS', 'Karnataka', 'SWR'),
('Mangalore Central', 'MAQ', 'Karnataka', 'KR'),

-- North Indian Stations
('Amritsar Junction', 'ASR', 'Punjab', 'NR'),
('Chandigarh', 'CDG', 'Chandigarh', 'NR'),
('Jaipur Junction', 'JP', 'Rajasthan', 'NWR'),
('Jodhpur Junction', 'JU', 'Rajasthan', 'NWR'),
('Udaipur City', 'UDZ', 'Rajasthan', 'NWR'),
('Ajmer Junction', 'AII', 'Rajasthan', 'NWR'),

-- Eastern Stations
('Kolkata', 'KOAA', 'West Bengal', 'ER'),
('Sealdah', 'SDAH', 'West Bengal', 'ER'),
('Durgapur', 'DGR', 'West Bengal', 'ER'),
('Asansol Junction', 'ASN', 'West Bengal', 'ER'),

-- Western Stations
('Vadodara Junction', 'BRC', 'Gujarat', 'WR'),
('Rajkot Junction', 'RJT', 'Gujarat', 'WR'),
('Bhavnagar Terminus', 'BVC', 'Gujarat', 'WR'),

-- Central Indian Stations
('Jabalpur', 'JBP', 'Madhya Pradesh', 'WCR'),
('Raipur Junction', 'R', 'Chhattisgarh', 'SECR'),
('Bilaspur Junction', 'BSP', 'Chhattisgarh', 'SECR'),

-- Additional Important Stations
('Gwalior Junction', 'GWL', 'Madhya Pradesh', 'NCR'),
('Agra Cantt', 'AGC', 'Uttar Pradesh', 'NCR'),
('Varanasi Junction', 'BSB', 'Uttar Pradesh', 'NER'),
('Gorakhpur Junction', 'GKP', 'Uttar Pradesh', 'NER'),
('Dehradun', 'DDN', 'Uttarakhand', 'NR'),
('Haridwar Junction', 'HW', 'Uttarakhand', 'NR'),

-- South-Central Stations
('Vijayawada Junction', 'BZA', 'Andhra Pradesh', 'SCR'),
('Visakhapatnam', 'VSKP', 'Andhra Pradesh', 'ECoR'),
('Tirupati', 'TPTY', 'Andhra Pradesh', 'SCR'),
('Warangal', 'WL', 'Telangana', 'SCR')

ON CONFLICT (code) DO NOTHING;
