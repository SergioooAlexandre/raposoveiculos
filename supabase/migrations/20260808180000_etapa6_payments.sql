-- Migration: Etapa 6 - Unicidade de Transação de Pagamentos
-- Created: 2026-08-08

-- Create a conditional unique index on transaction_id so we do not enforce uniqueness on NULL values
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_transaction_id_unique 
ON public.payments(transaction_id) 
WHERE transaction_id IS NOT NULL AND transaction_id <> '';
