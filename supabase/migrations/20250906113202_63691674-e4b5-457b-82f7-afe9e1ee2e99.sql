-- Create traffic monitoring tables
CREATE TABLE public.intersections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('active', 'maintenance', 'offline', 'warning')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id UUID REFERENCES public.intersections(id) ON DELETE CASCADE,
  vehicle_count INTEGER NOT NULL DEFAULT 0,
  congestion_level INTEGER CHECK (congestion_level >= 0 AND congestion_level <= 100) DEFAULT 0,
  average_speed DECIMAL(5, 2) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.signal_timing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id UUID REFERENCES public.intersections(id) ON DELETE CASCADE,
  red_time INTEGER NOT NULL DEFAULT 30,
  yellow_time INTEGER NOT NULL DEFAULT 5,
  green_time INTEGER NOT NULL DEFAULT 25,
  cycle_length INTEGER GENERATED ALWAYS AS (red_time + yellow_time + green_time) STORED,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.traffic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id UUID REFERENCES public.intersections(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('incident', 'maintenance', 'congestion', 'emergency')) NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  status TEXT CHECK (status IN ('active', 'resolved', 'in_progress')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.intersections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_timing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (traffic data is typically public)
CREATE POLICY "Traffic data is publicly viewable" ON public.intersections FOR SELECT USING (true);
CREATE POLICY "Traffic metrics are publicly viewable" ON public.traffic_data FOR SELECT USING (true);
CREATE POLICY "Signal timing is publicly viewable" ON public.signal_timing FOR SELECT USING (true);
CREATE POLICY "Traffic events are publicly viewable" ON public.traffic_events FOR SELECT USING (true);

-- Admin policies for modifications (only authenticated users can modify)
CREATE POLICY "Authenticated users can modify intersections" ON public.intersections FOR ALL USING (true);
CREATE POLICY "Authenticated users can modify traffic data" ON public.traffic_data FOR ALL USING (true);
CREATE POLICY "Authenticated users can modify signal timing" ON public.signal_timing FOR ALL USING (true);
CREATE POLICY "Authenticated users can modify traffic events" ON public.traffic_events FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_traffic_data_intersection_timestamp ON public.traffic_data(intersection_id, timestamp DESC);
CREATE INDEX idx_traffic_events_intersection_status ON public.traffic_events(intersection_id, status);
CREATE INDEX idx_intersections_status ON public.intersections(status);

-- Insert sample intersections
INSERT INTO public.intersections (name, location, latitude, longitude, status) VALUES
('Main St & Broadway', 'Downtown Core', 40.7128, -74.0060, 'active'),
('5th Ave & 42nd St', 'Midtown', 40.7549, -73.9840, 'active'),
('Park Ave & 59th St', 'Upper East Side', 40.7681, -73.9642, 'maintenance'),
('Houston St & Lafayette', 'SoHo', 40.7244, -73.9967, 'active'),
('Canal St & West Broadway', 'Tribeca', 40.7209, -74.0132, 'warning'),
('14th St & Union Square', 'Union Square', 40.7359, -73.9911, 'active'),
('23rd St & Park Ave', 'Flatiron', 40.7407, -73.9869, 'active'),
('34th St & 7th Ave', 'Penn Station', 40.7505, -73.9934, 'active'),
('Times Square & 7th Ave', 'Times Square', 40.7580, -73.9855, 'offline'),
('Columbus Circle & Broadway', 'Columbus Circle', 40.7681, -73.9819, 'active');

-- Insert signal timing for each intersection
INSERT INTO public.signal_timing (intersection_id, red_time, yellow_time, green_time)
SELECT id, 
  30 + (RANDOM() * 20)::INTEGER,  -- Red: 30-50 seconds
  4 + (RANDOM() * 3)::INTEGER,    -- Yellow: 4-7 seconds  
  25 + (RANDOM() * 15)::INTEGER   -- Green: 25-40 seconds
FROM public.intersections;

-- Insert realistic traffic data with varying patterns
INSERT INTO public.traffic_data (intersection_id, vehicle_count, congestion_level, average_speed, timestamp)
SELECT 
  i.id,
  (20 + RANDOM() * 80)::INTEGER,  -- Vehicle count: 20-100
  (RANDOM() * 100)::INTEGER,      -- Congestion: 0-100%
  (15 + RANDOM() * 35)::DECIMAL(5,2), -- Speed: 15-50 mph
  NOW() - (RANDOM() * INTERVAL '24 hours')
FROM public.intersections i
CROSS JOIN generate_series(1, 10); -- 10 data points per intersection

-- Insert some traffic events with fixed event_type selection
INSERT INTO public.traffic_events (intersection_id, event_type, description, severity, status) 
SELECT 
  i.id,
  CASE 
    WHEN RANDOM() < 0.25 THEN 'incident'
    WHEN RANDOM() < 0.5 THEN 'maintenance' 
    WHEN RANDOM() < 0.75 THEN 'congestion'
    ELSE 'emergency'
  END,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'Heavy traffic congestion detected'
    WHEN RANDOM() < 0.6 THEN 'Minor fender bender reported'
    ELSE 'Scheduled maintenance work'
  END,
  CASE 
    WHEN RANDOM() < 0.33 THEN 'low'
    WHEN RANDOM() < 0.66 THEN 'medium'
    ELSE 'high'
  END,
  CASE WHEN RANDOM() < 0.7 THEN 'active' ELSE 'resolved' END
FROM public.intersections i
WHERE RANDOM() < 0.4; -- Only some intersections have events

-- Create triggers for updating timestamps
CREATE TRIGGER update_intersections_updated_at BEFORE UPDATE ON public.intersections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signal_timing_updated_at BEFORE UPDATE ON public.signal_timing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();