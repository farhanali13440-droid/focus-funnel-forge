-- Unify public checkout payment uploads with the private admin payment-proof system.

-- Canonical private storage bucket for new payment proofs.
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

-- The public checkout is allowed to upload a proof, but never read/update/delete one.
DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
CREATE POLICY "Public can upload payment proofs"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

-- Link bookings to their CRM lead and retain the original uploaded filename.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS receipt_name TEXT;

CREATE INDEX IF NOT EXISTS bookings_lead_id_idx ON public.bookings (lead_id);

-- Secure helper used by the public checkout to create/reuse a CRM lead and return its id.
CREATE OR REPLACE FUNCTION public.create_checkout_lead(
  _full_name TEXT,
  _phone TEXT,
  _whatsapp TEXT,
  _email TEXT,
  _city TEXT,
  _service TEXT,
  _notes TEXT,
  _source TEXT,
  _campaign TEXT,
  _utm_source TEXT,
  _utm_medium TEXT,
  _utm_campaign TEXT,
  _utm_content TEXT,
  _utm_term TEXT,
  _landing_page TEXT,
  _referrer TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id UUID;
  new_id UUID;
BEGIN
  SELECT id INTO existing_id
  FROM public.leads
  WHERE (NULLIF(TRIM(_email), '') IS NOT NULL AND lower(email) = lower(TRIM(_email)))
     OR (NULLIF(TRIM(_phone), '') IS NOT NULL AND regexp_replace(phone, '\\D', '', 'g') = regexp_replace(TRIM(_phone), '\\D', '', 'g'))
  ORDER BY created_at DESC
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    UPDATE public.leads
    SET full_name = COALESCE(NULLIF(TRIM(_full_name), ''), full_name),
        whatsapp = COALESCE(NULLIF(TRIM(_whatsapp), ''), whatsapp),
        email = COALESCE(NULLIF(TRIM(_email), ''), email),
        city = COALESCE(NULLIF(TRIM(_city), ''), city),
        service = COALESCE(NULLIF(TRIM(_service), ''), service),
        campaign = COALESCE(NULLIF(TRIM(_campaign), ''), campaign),
        utm_source = COALESCE(NULLIF(TRIM(_utm_source), ''), utm_source),
        utm_medium = COALESCE(NULLIF(TRIM(_utm_medium), ''), utm_medium),
        utm_campaign = COALESCE(NULLIF(TRIM(_utm_campaign), ''), utm_campaign),
        utm_content = COALESCE(NULLIF(TRIM(_utm_content), ''), utm_content),
        utm_term = COALESCE(NULLIF(TRIM(_utm_term), ''), utm_term),
        landing_page = COALESCE(NULLIF(TRIM(_landing_page), ''), landing_page),
        referrer = COALESCE(NULLIF(TRIM(_referrer), ''), referrer),
        notes = COALESCE(NULLIF(TRIM(_notes), ''), notes),
        updated_at = now()
    WHERE id = existing_id;
    RETURN existing_id;
  END IF;

  INSERT INTO public.leads (
    full_name, phone, whatsapp, email, city, service, source, campaign,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    landing_page, referrer, status, notes
  ) VALUES (
    COALESCE(NULLIF(TRIM(_full_name), ''), 'Website Lead'),
    NULLIF(TRIM(_phone), ''),
    NULLIF(TRIM(_whatsapp), ''),
    NULLIF(TRIM(_email), ''),
    NULLIF(TRIM(_city), ''),
    COALESCE(NULLIF(TRIM(_service), ''), 'ADHD Clarity Workshop'),
    COALESCE(NULLIF(TRIM(_source), ''), 'Website'),
    NULLIF(TRIM(_campaign), ''),
    NULLIF(TRIM(_utm_source), ''),
    NULLIF(TRIM(_utm_medium), ''),
    NULLIF(TRIM(_utm_campaign), ''),
    NULLIF(TRIM(_utm_content), ''),
    NULLIF(TRIM(_utm_term), ''),
    NULLIF(TRIM(_landing_page), ''),
    NULLIF(TRIM(_referrer), ''),
    'New',
    NULLIF(TRIM(_notes), '')
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_checkout_lead(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_lead(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT) TO anon, authenticated;

-- Whenever checkout creates a booking, automatically mirror it into lead_payments.
-- This keeps the public checkout from needing permission to write directly to the admin-only payments table.
CREATE OR REPLACE FUNCTION public.sync_booking_to_lead_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.lead_id IS NOT NULL THEN
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
    ON CONFLICT (transaction_id) DO NOTHING;
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
