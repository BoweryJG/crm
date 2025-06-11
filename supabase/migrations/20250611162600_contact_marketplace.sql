-- Contact Marketplace Migration
-- Adds marketplace features, admin visibility, and fixes contact management

-- 1. Add new columns to contacts (safe - just adding)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS
  is_for_sale BOOLEAN DEFAULT FALSE,
  sale_price DECIMAL(10,2),
  sale_category TEXT,
  times_sold INTEGER DEFAULT 0,
  contact_status TEXT DEFAULT 'inactive' CHECK (contact_status IN (
    'active', 'inactive', 'for_sale', 'exclusive'
  )),
  visible_to TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  source TEXT,
  source_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contact_category TEXT DEFAULT 'crm';

-- 2. Backfill owner_id from created_by (safe)
UPDATE contacts 
SET owner_id = created_by 
WHERE owner_id IS NULL;

-- 3. Create purchases table (safe - new table)
CREATE TABLE IF NOT EXISTS contact_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  purchase_price DECIMAL(10,2),
  access_type TEXT DEFAULT 'view',
  notes TEXT
);

-- 4. Create admin table (safer than modifying auth.users)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Make yourself admin
INSERT INTO user_roles (user_id, is_admin) 
VALUES ('5fe37075-c2f5-4acd-abef-1ef15d0c1ffd', TRUE)
ON CONFLICT (user_id) DO UPDATE SET is_admin = TRUE;

-- 6. Enable RLS on new tables
ALTER TABLE contact_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 7. Update RLS policies for contacts
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own practices" ON contacts;
DROP POLICY IF EXISTS "Users can view their own contacts" ON contacts;

-- Create new comprehensive select policy
CREATE POLICY "contact_access_policy" ON contacts FOR SELECT
USING (
  -- Admin sees all
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND is_admin = TRUE)
  OR
  -- Owner sees their contacts
  owner_id = auth.uid()
  OR
  -- Users with purchased access
  auth.uid() = ANY(visible_to)
  OR
  -- Demo contacts visible to all
  contact_category = 'demo'
  OR
  -- Marketplace listings visible to browse
  (is_for_sale = TRUE)
);

-- Keep/recreate other policies
DROP POLICY IF EXISTS "Users can insert their own contacts" ON contacts;
CREATE POLICY "contact_insert_policy" ON contacts FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their own contacts" ON contacts;
CREATE POLICY "contact_update_policy" ON contacts FOR UPDATE
USING (owner_id = auth.uid() OR created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own contacts" ON contacts;
CREATE POLICY "contact_delete_policy" ON contacts FOR DELETE
USING (owner_id = auth.uid() OR created_by = auth.uid());

-- 8. Policies for contact_purchases
CREATE POLICY "Users can view their purchases" ON contact_purchases FOR SELECT
USING (buyer_id = auth.uid() OR EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND is_admin = TRUE
));

CREATE POLICY "Users can create purchases" ON contact_purchases FOR INSERT
WITH CHECK (buyer_id = auth.uid());

-- 9. Policies for user_roles (admin only)
CREATE POLICY "Only admins can view roles" ON user_roles FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.is_admin = TRUE
));

CREATE POLICY "Only admins can modify roles" ON user_roles FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.is_admin = TRUE
));

-- 10. Import demo data (safe - just inserts)
INSERT INTO contacts (
  first_name, last_name, email, phone, title, type, status,
  practice_name, notes, tags,
  owner_id, created_by, assigned_to, contact_category
)
SELECT 
  first_name, last_name, email, phone, title, type, status,
  practice_name, notes, tags,
  '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',
  '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',
  '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',
  'demo'
FROM public_contacts
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c 
  WHERE c.email = public_contacts.email 
  AND c.contact_category = 'demo'
);

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_for_sale ON contacts(is_for_sale) WHERE is_for_sale = TRUE;
CREATE INDEX IF NOT EXISTS idx_contacts_visible_to ON contacts USING GIN(visible_to);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(contact_category);
CREATE INDEX IF NOT EXISTS idx_contact_purchases_buyer ON contact_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_contact_purchases_contact ON contact_purchases(contact_id);

-- 12. Add helpful comments
COMMENT ON COLUMN contacts.is_for_sale IS 'Whether this contact is available for purchase in the marketplace';
COMMENT ON COLUMN contacts.visible_to IS 'Array of user IDs who have purchased access to this contact';
COMMENT ON COLUMN contacts.owner_id IS 'The user who owns this contact (can sell it)';
COMMENT ON COLUMN contacts.contact_category IS 'Type of contact: crm, demo, personal, etc.';
COMMENT ON TABLE contact_purchases IS 'Tracks marketplace purchases of contacts';
COMMENT ON TABLE user_roles IS 'User role assignments including admin status';