-- Fix: public checkout payment screenshot uploads were being rejected by
-- storage.objects row-level security.
--
-- The checkout intentionally uploads before a user is authenticated, so the
-- Storage INSERT policy must explicitly allow the anon role. Keep the bucket
-- private; this policy grants upload only and does not grant public read access.

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

-- Remove the earlier policy variants so the checkout has one canonical
-- upload rule. The new rule is deliberately limited to INSERT operations.
DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public payment proof uploads" ON storage.objects;

CREATE POLICY "Allow public payment proof uploads"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs'
  );

-- Keep payment proofs private. Only authenticated admins can read them.
DROP POLICY IF EXISTS "Admins can view payment proofs" ON storage.objects;
CREATE POLICY "Admins can view payment proofs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs'
    AND public.has_role(auth.uid(), 'admin')
  );
