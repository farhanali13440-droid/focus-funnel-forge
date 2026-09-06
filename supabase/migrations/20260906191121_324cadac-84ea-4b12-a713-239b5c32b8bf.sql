CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER,
  city TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  patient_type TEXT,
  mode TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  concern TEXT,
  receipt_path TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 999,
  currency TEXT NOT NULL DEFAULT 'PKR',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon;
GRANT INSERT ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);