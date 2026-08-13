-- Migration: Etapa 5 a 20 - Tabelas Recorrentes, Automações e Gateways
-- Created: 2026-08-08

-- 1. Alter subscriptions Table (Add Columns & Expand Status/Frequency Checks)
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS last_generated_at TIMESTAMPTZ;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Drop check constraints on subscriptions if they exist and recreate
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS check_subscription_status;
ALTER TABLE public.subscriptions ADD CONSTRAINT check_subscription_status CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED', 'FINISHED'));

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS check_frequency;
ALTER TABLE public.subscriptions ADD CONSTRAINT check_frequency CHECK (frequency IN ('MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL', 'PERSONALIZADA', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'CUSTOM'));

-- 2. Alter charges Table (Add billing_reference and Unique Idempotency Constraint)
ALTER TABLE public.charges ADD COLUMN IF NOT EXISTS billing_reference TEXT;

-- Remove constraint if it exists to prevent script errors
ALTER TABLE public.charges DROP CONSTRAINT IF EXISTS unique_sub_reference;
ALTER TABLE public.charges ADD CONSTRAINT unique_sub_reference UNIQUE (subscription_id, billing_reference);

-- 3. Create message_templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL UNIQUE, -- e.g., REMINDER_BEFORE_DUE, DUE_TODAY, OVERDUE_1_DAY, OVERDUE_3_DAYS, OVERDUE_7_DAYS, PAYMENT_CONFIRMED
    name TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'WHATSAPP' CONSTRAINT check_template_channel CHECK (channel IN ('WHATSAPP', 'EMAIL', 'SMS')),
    content TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create whatsapp_messages Table (Outbox Queue)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    charge_id UUID REFERENCES public.charges(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    provider_message_id TEXT, -- Meta/Asaas Message ID
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CONSTRAINT check_whatsapp_status CHECK (status IN (
        'SCHEDULED', 'QUEUED', 'PROCESSING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED'
    )),
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create webhook_events Table (Gateway webhook logging and idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL, -- e.g., 'asaas', 'mercadopago', 'pagarme'
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Uniqueness constraint for webhook event processing idempotency
ALTER TABLE public.webhook_events DROP CONSTRAINT IF EXISTS unique_provider_event;
ALTER TABLE public.webhook_events ADD CONSTRAINT unique_provider_event UNIQUE (provider, event_id);

-- 6. Performance Indexes for Autocomplete & Queue searches
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON public.whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_scheduled_at ON public.whatsapp_messages(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_charge_id ON public.whatsapp_messages(charge_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event ON public.webhook_events(provider, event_id);

-- 7. Triggers for Auto-Updating updated_at in new tables
CREATE TRIGGER trigger_update_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- message_templates
CREATE POLICY select_templates ON public.message_templates FOR SELECT USING (public.is_active_user(auth.uid()));
CREATE POLICY manage_templates ON public.message_templates FOR ALL USING (public.is_admin(auth.uid()));

-- whatsapp_messages
CREATE POLICY select_whatsapp_messages ON public.whatsapp_messages FOR SELECT USING (public.is_active_user(auth.uid()));
CREATE POLICY write_whatsapp_messages ON public.whatsapp_messages FOR INSERT WITH CHECK (public.is_active_user(auth.uid()));
CREATE POLICY update_whatsapp_messages ON public.whatsapp_messages FOR UPDATE USING (public.is_active_user(auth.uid())) WITH CHECK (public.is_active_user(auth.uid()));
CREATE POLICY delete_whatsapp_messages ON public.whatsapp_messages FOR DELETE USING (public.is_admin(auth.uid()));

-- webhook_events
CREATE POLICY select_webhook_events ON public.webhook_events FOR SELECT USING (public.is_active_user(auth.uid()));
CREATE POLICY write_webhook_events ON public.webhook_events FOR INSERT WITH CHECK (TRUE); -- Allow webhooks inserts without active user session
CREATE POLICY update_webhook_events ON public.webhook_events FOR UPDATE USING (public.is_active_user(auth.uid())) WITH CHECK (public.is_active_user(auth.uid()));

-- 10. Seed standard templates if they do not exist
INSERT INTO public.message_templates (type, name, content)
VALUES 
('REMINDER_BEFORE_DUE', 'Lembrete 3 dias antes', 'Olá, {{cliente}}! 👋\n\nPassando para lembrar que sua cobrança referente a {{servico}} vence em {{vencimento}}.\n\nValor: {{valor}}\n\nCaso já tenha realizado o pagamento, desconsidere.\n\nNexus Sites BR.'),
('DUE_TODAY', 'Cobrança do Dia', 'Olá, {{cliente}}!\n\nSua cobrança referente a {{servico}} vence hoje.\n\nValor: {{valor}}\n\nCaso já tenha realizado o pagamento, desconsidere esta mensagem.\n\nNexus Sites BR.'),
('OVERDUE_1_DAY', 'Cobrança 1 Dia Vencido', 'Olá, {{cliente}}.\n\nIdentificamos que a cobrança referente a {{servico}}, com vencimento em {{vencimento}}, ainda consta como pendente.\n\nValor: {{valor}}\n\nCaso já tenha efetuado o pagamento, desconsidere esta mensagem.\n\nNexus Sites BR.'),
('OVERDUE_3_DAYS', 'Cobrança 3 Dias Vencido', 'Olá, {{cliente}}.\n\nSua mensalidade de {{servico}} com vencimento em {{vencimento}} está atrasada há 3 dias. Evite suspensão dos serviços realizando o pagamento.\n\nValor: {{valor}}\n\nNexus Sites BR.'),
('OVERDUE_7_DAYS', 'Cobrança 7 Dias Vencido', 'Olá, {{cliente}}.\n\nURGENTE: Notamos que o pagamento de {{servico}} (Vencido em {{vencimento}}) está com 7 dias de atraso. Os serviços serão suspensos caso o pagamento não seja identificado.\n\nValor: {{valor}}\n\nNexus Sites BR.'),
('PAYMENT_CONFIRMED', 'Confirmação de Pagamento', 'Pagamento confirmado! ✅\n\nOlá, {{cliente}}.\n\nRecebemos seu pagamento referente a {{servico}}.\n\nValor: {{valor}}\n\nObrigado pela confiança na Nexus Sites BR.')
ON CONFLICT (type) DO UPDATE SET content = EXCLUDED.content;
