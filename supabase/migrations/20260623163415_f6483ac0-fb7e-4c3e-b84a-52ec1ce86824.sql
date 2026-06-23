
-- 1) PROFILES: replace blanket SELECT with scoped policies
DROP POLICY IF EXISTS "Authenticated can view profiles" ON public.profiles;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "View counterparty profiles via orders"
  ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE (o.buyer_id = auth.uid() AND o.farmer_id = profiles.id)
       OR (o.farmer_id = auth.uid() AND o.buyer_id = profiles.id)
  ));

CREATE POLICY "View farmer profiles for active listings"
  ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.produce_listings l
    WHERE l.farmer_id = profiles.id AND l.status = 'active'
  ));

-- 2) ORDERS: limit UPDATE to escrow_status column only via column-level grants
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE (escrow_status) ON public.orders TO authenticated;
GRANT UPDATE ON public.orders TO service_role;

-- 3) REALTIME: enable RLS on realtime.messages and scope channel topics per user
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users subscribe to own notif channel" ON realtime.messages;
CREATE POLICY "Users subscribe to own notif channel"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    (SELECT realtime.topic()) = 'notif-' || (SELECT auth.uid())::text
  );
