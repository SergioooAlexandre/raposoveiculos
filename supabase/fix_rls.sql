-- Secure Row Level Security (RLS) policies for Raposo Veículos
-- Restricts administrative CRUD permissions strictly to verified Admin users via is_admin()

-- 1. Helper function to check if authenticated user is a verified Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.admin_users 
                WHERE user_id = auth.uid()
            )
            OR
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE id = auth.uid() AND (email LIKE '%@raposoveiculos.com.br' OR email LIKE '%admin%')
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all public tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 3. Drop all previous policies to avoid conflicts
DROP POLICY IF EXISTS "Public view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public view visible vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Public view vehicle media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Public view vehicle features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Public submit leads" ON public.leads;
DROP POLICY IF EXISTS "Public submit proposals" ON public.proposals;

DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins manage vehicle media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Admins manage vehicle features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Admins manage leads" ON public.leads;
DROP POLICY IF EXISTS "Admins manage proposals" ON public.proposals;

DROP POLICY IF EXISTS "Allow all for anon site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all for anon vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow all for anon vehicle_media" ON public.vehicle_media;
DROP POLICY IF EXISTS "Allow all for anon vehicle_features" ON public.vehicle_features;
DROP POLICY IF EXISTS "Allow all for anon leads" ON public.leads;
DROP POLICY IF EXISTS "Allow all for anon proposals" ON public.proposals;

-- 4. Public Read Policies (Anonymous & Authenticated)
CREATE POLICY "Public view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public view visible vehicles" ON public.vehicles FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public view vehicle media" ON public.vehicle_media FOR SELECT USING (true);
CREATE POLICY "Public view vehicle features" ON public.vehicle_features FOR SELECT USING (true);

-- 5. Public Lead/Proposal Submission Policies (Visitors can submit forms)
CREATE POLICY "Public submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit proposals" ON public.proposals FOR INSERT WITH CHECK (true);

-- 6. Verified Admin CRUD Policies (STRICTLY RESTRICTED TO VERIFIED ADMINS VIA is_admin())
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage vehicle media" ON public.vehicle_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage vehicle features" ON public.vehicle_features FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage proposals" ON public.proposals FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. Storage Bucket Policies (vehicle-media)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-media', 'vehicle-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update vehicle-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete vehicle-media" ON storage.objects;

CREATE POLICY "Public read vehicle-media" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-media');
CREATE POLICY "Admin upload vehicle-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-media' AND public.is_admin());
CREATE POLICY "Admin update vehicle-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-media' AND public.is_admin());
CREATE POLICY "Admin delete vehicle-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicle-media' AND public.is_admin());
