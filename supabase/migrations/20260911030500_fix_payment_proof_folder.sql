-- Keep the existing checkout and admin UI unchanged.
-- This migration only makes sure uploaded payment proofs are saved into
-- the same payment-proofs folder/table that the admin portal already reads.

-- Ensure the private storage bucket used by the checkout exists.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  8388608,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 8388608,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Public checkout may upload proof files; only the authenticated admin portal
-- creates signed URLs to view them.
DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
CREATE POLICY "Public can upload payment proofs"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

-- These columns are used only to connect the existing booking to its proof.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS receipt_name TEXT;

CREATE INDEX IF NOT EXISTS bookings_lead_id_idx ON public.bookings (lead_id);

-- Make the payment record idempotent per checkout transaction.
CREATE UNIQUE INDEX IF NOT EXISTS lead_payments_transaction_id_unique_idx
  ON public.lead_payments (transaction_id);

-- Every new checkout booking automatically appears in the admin Payment Proofs folder.
CREATE OR REPLACE FUNCTION public.sync_booking_to_lead_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.lead_id IS NOT NULL AND NEW.receipt_path IS NOT NULL THEN
    INSERT INTO public.lead_payments (
      lead_id,
      amount,
      payment_date,
      payment_method,
      transaction_id,
      status,
      notes,
      file_path,
      file_name,
      file_type,
      file_size
    ) VALUES (
      NEW.lead_id,
      NEW.amount,
      NEW.created_at::date,
      'Bank Transfer',
      NEW.transaction_id,
      'Pending Verification',
      NEW.concern,
      NEW.receipt_path,
      COALESCE(NEW.receipt_name, split_part(NEW.receipt_path, '/', 2)),
      CASE
        WHEN lower(NEW.receipt_path) LIKE '%.png' THEN 'image/png'
        WHEN lower(NEW.receipt_path) LIKE '%.webp' THEN 'image/webp'
        WHEN lower(NEW.receipt_path) LIKE '%.jpeg' THEN 'image/jpeg'
        ELSE 'image/jpeg'
      END,
      NULL
    )
    ON CONFLICT (transaction_id) DO UPDATE
    SET lead_id = EXCLUDED.lead_id,
        amount = EXCLUDED.amount,
        file_path = EXCLUDED.file_path,
        file_name = EXCLUDED.file_name,
        status = CASE
          WHEN public.lead_payments.status IN ('Verified', 'Rejected', 'Refunded')
            THEN public.lead_payments.status
          ELSE 'Pending Verification'
        END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_sync_lead_payment ON public.bookings;
CREATE TRIGGER bookings_sync_lead_payment
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.sync_booking_to_lead_payment();

REVOKE ALL ON FUNCTION public.sync_booking_to_lead_payment() FROM PUBLIC, anon, authenticated;

-- Backfill bookings that already have a payment screenshot so they appear in
-- the existing admin Payment Proofs folder immediately after migration.
INSERT INTO public.lead_payments (
  lead_id,
  amount,
  payment_date,
  payment_method,
  transaction_id,
  status,
  notes,
  file_path,
  file_name,
  file_type,
  file_size
)
SELECT
  b.lead_id,
  b.amount,
  b.created_at::date,
  'Bank Transfer',
  b.transaction_id,
  'Pending Verification',
  b.concern,
  b.receipt_path,
  COALESCE(b.receipt_name, split_part(b.receipt_path, '/', 2)),
  CASE
    WHEN lower(b.receipt_path) LIKE '%.png' THEN 'image/png'
    WHEN lower(b.receipt_path) LIKE '%.webp' THEN 'image/webp'
    WHEN lower(b.receipt_path) LIKE '%.jpeg' THEN 'image/jpeg'
    ELSE 'image/jpeg'
  END,
  NULL
FROM public.bookings b
WHERE b.lead_id IS NOT NULL
  AND b.receipt_path IS NOT NULL
ON CONFLICT (transaction_id) DO UPDATE
SET lead_id = EXCLUDED.lead_id,
    amount = EXCLUDED.amount,
    file_path = EXCLUDED.file_path,
    file_name = EXCLUDED.file_name;
