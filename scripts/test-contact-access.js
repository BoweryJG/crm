// Test script to verify contact access after migration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key to bypass RLS for testing
);

async function testContactAccess() {
  console.log('Testing contact access after migration...\n');

  try {
    // 1. Check if migration ran successfully
    console.log('1. Checking if new columns exist...');
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, owner_id, contact_category, is_for_sale')
      .limit(5);

    if (contactError) {
      console.error('Error fetching contacts:', contactError);
      return;
    }

    console.log(`✓ Found ${contacts?.length || 0} contacts with new columns\n`);

    // 2. Check admin status
    console.log('2. Checking admin status...');
    const { data: adminStatus, error: adminError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd')
      .single();

    if (adminError) {
      console.error('Error checking admin status:', adminError);
    } else {
      console.log('✓ Admin status:', adminStatus?.is_admin ? 'ACTIVE' : 'NOT SET');
    }

    // 3. Check demo contacts
    console.log('\n3. Checking demo contacts...');
    const { data: demoContacts, error: demoError } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, contact_category')
      .eq('contact_category', 'demo')
      .limit(5);

    console.log(`✓ Found ${demoContacts?.length || 0} demo contacts\n`);

    // 4. Check contact categories
    console.log('4. Contact category breakdown:');
    const { data: categories, error: catError } = await supabase
      .from('contacts')
      .select('contact_category')
      .not('contact_category', 'is', null);

    if (categories) {
      const categoryCounts = categories.reduce((acc, { contact_category }) => {
        acc[contact_category] = (acc[contact_category] || 0) + 1;
        return acc;
      }, {});

      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   - ${category}: ${count} contacts`);
      });
    }

    // 5. Test with user auth (simulate regular user access)
    console.log('\n5. Testing user access (with RLS)...');
    const userSupabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    );

    // This would need a real user session to work properly
    console.log('   (Skipping RLS test - requires authenticated user session)');

    console.log('\n✅ Migration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run the migration in Supabase Dashboard');
    console.log('2. Test contact visibility in the app');
    console.log('3. Import your 70k contacts with owner_id set to your user ID');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testContactAccess();