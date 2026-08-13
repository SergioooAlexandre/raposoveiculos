-- Migration: Etapa 4 - Projects and Contracts
-- Created: 2026-08-08

-- 1. Create Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    contract_number TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CONSTRAINT check_contract_status CHECK (status IN ('DRAFT', 'SENT', 'SIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    signed_at TIMESTAMPTZ,
    start_date DATE,
    end_date DATE,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Performance Indexes for Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON public.contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);

-- 3. Trigger for Auto-Updating updated_at in Contracts
CREATE TRIGGER trigger_update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Contracts
CREATE POLICY select_contracts ON public.contracts FOR SELECT USING (public.is_active_user(auth.uid()));
CREATE POLICY write_contracts ON public.contracts FOR INSERT WITH CHECK (public.is_active_user(auth.uid()));
CREATE POLICY update_contracts ON public.contracts FOR UPDATE USING (public.is_active_user(auth.uid())) WITH CHECK (public.is_active_user(auth.uid()));
CREATE POLICY delete_contracts ON public.contracts FOR DELETE USING (public.is_admin(auth.uid()));

-- 6. Alter Installments Status check constraint to match step 15 specifications
-- Drop constraint check_inst_status if it exists
ALTER TABLE public.installments DROP CONSTRAINT IF EXISTS check_inst_status;

-- Add new constraint matching: PENDING, DUE_SOON, OVERDUE, PAID, CANCELLED
ALTER TABLE public.installments ADD CONSTRAINT check_inst_status CHECK (status IN ('PENDING', 'DUE_SOON', 'OVERDUE', 'PAID', 'CANCELLED'));

-- Set default value to 'PENDING'
ALTER TABLE public.installments ALTER COLUMN status SET DEFAULT 'PENDING';
