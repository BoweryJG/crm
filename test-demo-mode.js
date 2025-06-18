const https = require('https');

console.log('Testing CRM demo mode...');

const options = {
  hostname: 'crm.repspheres.com',
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Location Header: ${res.headers.location || 'No redirect'}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Check if response contains login redirect
    if (data.includes('window.location') && data.includes('/login')) {
      console.log('❌ FAILED: Page contains JavaScript redirect to /login');
    } else if (data.includes('Sign in to access your CRM')) {
      console.log('❌ FAILED: Login page is being served');
    } else if (data.includes('Dashboard') || data.includes('Contacts') || data.includes('SPHERE')) {
      console.log('✅ SUCCESS: Demo mode appears to be working');
    } else {
      console.log('⚠️  UNCLEAR: Unable to determine page content');
      console.log('First 500 chars:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();