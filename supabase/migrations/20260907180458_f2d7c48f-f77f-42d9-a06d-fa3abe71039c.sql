CREATE POLICY "Admins read payment proofs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload payment proofs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update payment proofs" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete payment proofs" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.has_role(auth.uid(), 'admin'));