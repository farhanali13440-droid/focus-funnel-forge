-- Make transaction_id directly usable as the idempotency conflict target.
DROP INDEX IF EXISTS public.lead_payments_transaction_id_unique_idx;
CREATE UNIQUE INDEX IF NOT EXISTS lead_payments_transaction_id_unique_idx
  ON public.lead_payments (transaction_id);
