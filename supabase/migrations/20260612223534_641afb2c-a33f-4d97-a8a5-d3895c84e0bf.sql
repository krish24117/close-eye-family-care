DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'waitlist_urgency') THEN
    CREATE TYPE public.waitlist_urgency AS ENUM ('within_week', 'one_to_three_months', 'exploring');
  END IF;
END $$;

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS urgency public.waitlist_urgency;