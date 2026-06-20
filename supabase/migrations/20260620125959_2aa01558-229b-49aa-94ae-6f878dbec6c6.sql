
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer','buyer')),
  region TEXT,
  cooperative_name TEXT,
  id_type TEXT,
  id_number TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Any signed-in user can view profiles (needed so buyers can see farmer name/coop in marketplace, and farmers see buyer names on orders)
CREATE POLICY "Authenticated can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email, role, region, cooperative_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role','farmer'),
    NEW.raw_user_meta_data->>'region',
    NEW.raw_user_meta_data->>'cooperative_name'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PRODUCE LISTINGS
CREATE TABLE public.produce_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  region TEXT NOT NULL,
  availability_date DATE,
  cold_storage BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','sold')),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produce_listings TO authenticated;
GRANT ALL ON public.produce_listings TO service_role;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in views active listings" ON public.produce_listings FOR SELECT TO authenticated USING (status = 'active' OR farmer_id = auth.uid());
CREATE POLICY "Farmer inserts own listing" ON public.produce_listings FOR INSERT TO authenticated WITH CHECK (farmer_id = auth.uid());
CREATE POLICY "Farmer updates own listing" ON public.produce_listings FOR UPDATE TO authenticated USING (farmer_id = auth.uid()) WITH CHECK (farmer_id = auth.uid());
CREATE POLICY "Farmer deletes own listing" ON public.produce_listings FOR DELETE TO authenticated USING (farmer_id = auth.uid());

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.produce_listings(id) ON DELETE RESTRICT,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity_kg NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  escrow_status TEXT NOT NULL DEFAULT 'funds_held' CHECK (escrow_status IN ('funds_held','ready_for_delivery','in_transit','delivered','released_to_farmer')),
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyer or farmer reads own orders" ON public.orders FOR SELECT TO authenticated USING (buyer_id = auth.uid() OR farmer_id = auth.uid());
CREATE POLICY "Buyer creates own order" ON public.orders FOR INSERT TO authenticated WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Buyer or farmer updates own order" ON public.orders FOR UPDATE TO authenticated USING (buyer_id = auth.uid() OR farmer_id = auth.uid()) WITH CHECK (buyer_id = auth.uid() OR farmer_id = auth.uid());

-- CREDIT APPLICATIONS
CREATE TABLE public.credit_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('input_credit','invoice_financing','insurance')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  crop_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_applications TO authenticated;
GRANT ALL ON public.credit_applications TO service_role;
ALTER TABLE public.credit_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmer manages own applications" ON public.credit_applications FOR ALL TO authenticated USING (farmer_id = auth.uid()) WITH CHECK (farmer_id = auth.uid());

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  kind TEXT NOT NULL DEFAULT 'Orders',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User manages own notifications" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- WALLET TRANSACTIONS
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit','debit')),
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmer manages own wallet tx" ON public.wallet_transactions FOR ALL TO authenticated USING (farmer_id = auth.uid()) WITH CHECK (farmer_id = auth.uid());

-- Helpful indexes
CREATE INDEX idx_listings_farmer ON public.produce_listings(farmer_id);
CREATE INDEX idx_listings_status ON public.produce_listings(status);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_farmer ON public.orders(farmer_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_wallet_farmer ON public.wallet_transactions(farmer_id);
