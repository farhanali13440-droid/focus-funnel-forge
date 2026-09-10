-- The checkout sync trigger uses transaction_id for idempotency.
-- Existing lead_payments rows may contain null transaction ids, so use a partial unique index.
CREATE UNIQUE INDEX IF NOT EXISTS lead_payments_transaction_id_unique_idx
  ON public.lead_payments (transaction_id)
  WHERE transaction_id IS NOT NULL;
