-- Secure Row Level Security (RLS) policies for Raposo Veículos
-- Public visitors: Can read visible vehicles & settings, and submit leads/proposals.
-- Authenticated Admins: Full INSERT, UPDATE, DELETE permissions on all tables & storage.

-- 1. Enable RLS on all public tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 2. Drop all previous policies
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

-- 3. Public Read Policies
CREATE POLICY "Public view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public view visible vehicles" ON public.vehicles FOR SELECT USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Public view vehicle media" ON public.vehicle_media FOR SELECT USING (true);
CREATE POLICY "Public view vehicle features" ON public.vehicle_features FOR SELECT USING (true);

-- 4. Public Lead/Proposal Submission Policies
CREATE POLICY "Public submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit proposals" ON public.proposals FOR INSERT WITH CHECK (true);

-- 5. Authenticated Admin CRUD Policies
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage vehicle media" ON public.vehicle_media FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage vehicle features" ON public.vehicle_features FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins manage proposals" ON public.proposals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Storage Bucket Policies (vehicle-media)
-- Ensure vehicle-media bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-media', 'vehicle-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete vehicle-media" ON storage.objects;

CREATE POLICY "Public read vehicle-media" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-media');
CREATE POLICY "Admin upload vehicle-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-media');
CREATE POLICY "Admin update vehicle-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-media');
CREATE POLICY "Admin delete vehicle-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicle-media');
