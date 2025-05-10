import axios from 'axios';

// Get the backend URL from environment variables or use the default
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';

async function testBackendConnection() {
  console.log(`Testing connection to backend at: ${BACKEND_URL}`);
  
  try {
    // Test 1: Health check endpoint
    console.log('\nTest 1: Checking backend health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check successful:', healthResponse.data);
    
    // Test 2: Test the webhook endpoint with a simple prompt
    console.log('\nTest 2: Testing webhook endpoint...');
    const webhookResponse = await axios.post(`${BACKEND_URL}/webhook`, {
      prompt: 'This is a test prompt from the SphereOsCrM frontend.',
      model: 'openai/gpt-3.5-turbo'
    });
    
    console.log('✅ Webhook test successful!');
    console.log('Response data:', JSON.stringify(webhookResponse.data, null, 2));
    
    // Test 3: Check user usage endpoint
    console.log('\nTest 3: Testing user/usage endpoint...');
    const usageResponse = await axios.get(`${BACKEND_URL}/user/usage`);
    console.log('✅ Usage endpoint test successful:', usageResponse.data);
    
    console.log('\nAll tests passed! 🎉 Your frontend is successfully connected to the backend.');
    return true;
  } catch (error) {
    console.error('❌ Backend connection test failed:');
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received. The server might be down or unreachable.');
      } else {
        console.error('Error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if the backend is running and accessible');
    console.log('2. Verify the REACT_APP_BACKEND_URL in your .env.local file');
    console.log('3. Check if your network allows connections to the backend URL');
    console.log('4. Look for any CORS issues in the browser console');
    
    return false;
  }
}

// Run the test
testBackendConnection();
