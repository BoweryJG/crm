const https = require('https');

// Your API credentials
const API_KEY = 'upfQ4yuxVID9g9AUwDhxVkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf';

// Test API connection
function testAPI() {
  console.log('🔧 Testing Freesound API connection...\n');
  
  const options = {
    hostname: 'freesound.org',
    path: `/apiv2/sounds/256113/?token=${API_KEY}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };
  
  https.get(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\nResponse:');
      console.log(data);
      
      try {
        const parsed = JSON.parse(data);
        if (parsed.detail) {
          console.log('\n❌ Error:', parsed.detail);
        } else if (parsed.name) {
          console.log('\n✅ Success! Sound found:', parsed.name);
          console.log('Preview URLs:', parsed.previews);
        }
      } catch (e) {
        console.log('\n❌ Failed to parse response');
      }
    });
  }).on('error', (err) => {
    console.error('Request error:', err);
  });
}

testAPI();