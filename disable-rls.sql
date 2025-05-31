-- Temporarily disable RLS on public_contacts table
ALTER TABLE public_contacts DISABLE ROW LEVEL SECURITY;

-- Optional: Also drop existing policies if needed
-- DROP POLICY IF EXISTS "policy_name" ON public_contacts;