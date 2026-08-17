-- Raposo Veículos - PostgreSQL Database Schema Migration Script
-- Comprehensive Database Definition for Supabase with Permissive RLS & Storage

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLES

-- Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Raposo Veículos',
    whatsapp TEXT NOT NULL DEFAULT '5579998476431',
    phone TEXT NOT NULL DEFAULT '(79) 99847-6431',
    email TEXT NOT NULL DEFAULT 'contato@raposoveiculos.com.br',
    instagram TEXT DEFAULT '@nexussitesbr',
    address TEXT DEFAULT 'Rodovia Raposo Tavares, km 18 - São Paulo, SP',
    opening_hours TEXT DEFAULT 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h',
    logo_url TEXT,
    favicon_url TEXT,
    seo_title TEXT DEFAULT 'Raposo Veículos | Catálogo Digital Premium',
    seo_description TEXT DEFAULT 'Veículos selecionados, vistoriados, com procedência garantida, simulação de financiamento e as melhores condições.',
    og_image TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'ADMIN' CONSTRAINT check_admin_role CHECK (role IN ('ADMIN', 'GERENTE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT NOT NULL,
    year INTEGER NOT NULL,
    model_year INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL CONSTRAINT check_price_positive CHECK (price >= 0),
    promotional_price NUMERIC(12, 2) CONSTRAINT check_promotional_price CHECK (promotional_price IS NULL OR promotional_price >= 0),
    mileage INTEGER NOT NULL DEFAULT 0 CONSTRAINT check_mileage_positive CHECK (mileage >= 0),
    fuel TEXT NOT NULL DEFAULT 'FLEX' CONSTRAINT check_fuel CHECK (fuel IN ('FLEX', 'GASOLINA', 'ETANOL', 'DIESEL', 'HIBRIDO', 'ELETRICO')),
    transmission TEXT NOT NULL DEFAULT 'AUTOMATICO' CONSTRAINT check_transmission CHECK (transmission IN ('AUTOMATICO', 'MANUAL', 'CVT', 'SEMI_AUTOMATICO', 'DUPLA_EMBREAGEM')),
    body_type TEXT NOT NULL DEFAULT 'SUV' CONSTRAINT check_body_type CHECK (body_type IN ('SUV', 'SEDAN', 'HATCH', 'PICKUP', 'COUPE', 'CONVERSIVEL', 'VAN', 'MINIVAN', 'OUTRO')),
    color TEXT NOT NULL DEFAULT 'Preto',
    engine TEXT NOT NULL DEFAULT '2.0',
    power TEXT NOT NULL DEFAULT '180 cv',
    traction TEXT NOT NULL DEFAULT 'Dianteira',
    doors INTEGER NOT NULL DEFAULT 4 CONSTRAINT check_doors CHECK (doors BETWEEN 2 AND 6),
    plate_end TEXT NOT NULL DEFAULT '0',
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'DISPONIVEL' CONSTRAINT check_vehicle_status CHECK (status IN ('DISPONIVEL', 'RESERVADO', 'VENDIDO')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_offer BOOLEAN NOT NULL DEFAULT FALSE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicle Media Table
CREATE TABLE IF NOT EXISTS public.vehicle_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'image' CONSTRAINT check_media_type CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    storage_path TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicle Features Table (Opcionais)
CREATE TABLE IF NOT EXISTS public.vehicle_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    CONSTRAINT unique_vehicle_feature UNIQUE (vehicle_id, feature_name)
);

-- Leads / Contacts Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NOVO' CONSTRAINT check_lead_status CHECK (status IN ('NOVO', 'EM_ATENDIMENTO', 'RESPONDIDO', 'FINALIZADO')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    proposal_value NUMERIC(12, 2) NOT NULL CONSTRAINT check_prop_value CHECK (proposal_value > 0),
    down_payment NUMERIC(12, 2) NOT NULL DEFAULT 0 CONSTRAINT check_down_payment CHECK (down_payment >= 0),
    installments_count INTEGER DEFAULT 48,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'NOVA' CONSTRAINT check_proposal_status CHECK (status IN ('NOVA', 'EM_ANALISE', 'NEGOCIANDO', 'APROVADA', 'RECUSADA', 'FINALIZADA')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRIGGERS
CREATE TRIGGER trigger_update_site_settings_updated_at 
    BEFORE UPDATE ON public.site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_vehicles_updated_at 
    BEFORE UPDATE ON public.vehicles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON public.vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON public.vehicles(model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON public.vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_offer ON public.vehicles(is_offer);
CREATE INDEX IF NOT EXISTS idx_vehicle_media_vehicle ON public.vehicle_media(vehicle_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vehicle_features_vehicle ON public.vehicle_features(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_vehicle ON public.leads(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_proposals_vehicle ON public.proposals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for Anon Key (password RP2026 application access)
CREATE POLICY "Allow all for anon site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicle_media" ON public.vehicle_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon vehicle_features" ON public.vehicle_features FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);

-- 6. INITIAL SETTINGS SEED
INSERT INTO public.site_settings (store_name, whatsapp, phone, email, instagram, address, opening_hours, seo_title, seo_description)
SELECT 'Raposo Veículos', '5579998476431', '(79) 99847-6431', 'contato@raposoveiculos.com.br', '@nexussitesbr', 'Rodovia Raposo Tavares, km 18 - São Paulo, SP', 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h', 'Raposo Veículos | Catálogo Digital Premium', 'Veículos selecionados, vistoriados, com procedência garantida, simulação de financiamento e as melhores condições.'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
