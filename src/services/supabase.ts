import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://bdznvazjusxevdtdtuvr.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_X7Pi041iRpaKDV0OogPXGQ_B01F3UKG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/bdznvazjusxevdtdtuvr/sql)

-- 1. Create RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  attending TEXT NOT NULL DEFAULT 'yes',
  guest_count INTEGER DEFAULT 1,
  contact TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Guestbook table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Public Access / RLS policies for Wedding Guests & Organizer
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public insert RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public update RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public delete RSVPs" ON public.rsvps;

DROP POLICY IF EXISTS "Allow public read Guestbook" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public insert Guestbook" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public update Guestbook" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public delete Guestbook" ON public.guestbook;

-- Create policies
CREATE POLICY "Allow public read RSVPs" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public insert RSVPs" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update RSVPs" ON public.rsvps FOR UPDATE USING (true);
CREATE POLICY "Allow public delete RSVPs" ON public.rsvps FOR DELETE USING (true);

CREATE POLICY "Allow public read Guestbook" ON public.guestbook FOR SELECT USING (true);
CREATE POLICY "Allow public insert Guestbook" ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update Guestbook" ON public.guestbook FOR UPDATE USING (true);
CREATE POLICY "Allow public delete Guestbook" ON public.guestbook FOR DELETE USING (true);
`;
