CREATE POLICY "Anyone can upload a payment receipt"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-receipts');