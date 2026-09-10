-- Simple payment-proof folder only.
-- No lead_id, CRM, booking, trigger, or payment-table changes.

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

DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
CREATE POLICY "Public can upload payment proofs"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Admins can view payment proofs" ON storage.objects;
CREATE POLICY "Admins can view payment proofs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));
