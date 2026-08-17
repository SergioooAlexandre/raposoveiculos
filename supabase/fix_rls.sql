-- Fix Row Level Security (RLS) policies for Raposo Veículos
-- Allows full SELECT, INSERT, UPDATE, DELETE for public/anon key access (single password RP2026 authentication)

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Drop restrictive admin policies if they exist
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Public can read vehicle media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Admins can manage vehicle media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Public can read vehicle features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Admins can manage vehicle features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Public can insert proposals" ON public.proposals;
DROP POLICY IF EXISTS "Admins can manage proposals" ON public.proposals;

DROP POLICY IF EXISTS "Allow all for anon site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all for anon vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow all for anon vehicle_media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Allow all for anon vehicle_features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Allow all for anon leads" ON public.leads;
DROP POLICY IF EXISTS "Allow all for anon proposals" ON public.proposals;

-- Create permissive RLS policies for Anon key access
CREATE POLICY "Allow all for anon site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicle_media" ON public.vehicle_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicle_features" ON public.vehicle_features FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);
