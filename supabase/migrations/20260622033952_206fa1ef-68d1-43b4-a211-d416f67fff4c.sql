ALTER TABLE public.credit_applications
  ADD COLUMN IF NOT EXISTS buyer_name text,
  ADD COLUMN IF NOT EXISTS delivery_date date,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.credit_applications DROP CONSTRAINT IF EXISTS credit_applications_status_check;
ALTER TABLE public.credit_applications
  ADD CONSTRAINT credit_applications_status_check
  CHECK (status = ANY (ARRAY['submitted','under_review','approved','rejected','cancelled']));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_prefs jsonb NOT NULL
  DEFAULT '{"orders":true,"prices":true,"finance":true,"marketing":false}'::jsonb;

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;