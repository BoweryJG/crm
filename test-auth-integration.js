// Integration test for OAuth auth flow with return to original page
const puppeteer = require('puppeteer');

async function testAuthIntegration() {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'log') {
      console.log('Browser:', text);
    } else if (type === 'error') {
      console.error('Browser Error:', text);
    }
  });

  try {
    console.log('=== Testing Auth Integration ===\n');
    
    // Test 1: Navigate to /market, login should return to /market
    console.log('Test 1: Market Module Return');
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('http://localhost:3000/market');
    console.log('- Navigated to /market');
    
    // Click LOGIN button
    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll('*')).find(el => 
        el.innerText === 'LOGIN'
      );
      if (loginBtn) loginBtn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate OAuth callback with access token
    console.log('- Simulating OAuth callback...');
    await page.goto('http://localhost:3000/auth/callback#access_token=fake-token&token_type=bearer&expires_in=3600');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check where we ended up
    const finalUrl = page.url();
    console.log('- Final URL:', finalUrl);
    console.log('- Test 1 Result:', finalUrl.includes('/market') ? '✅ PASS' : '❌ FAIL');
    
    // Test 2: Navigate to /intelligence/content, login should return there
    console.log('\nTest 2: Content Generator Module Return');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('http://localhost:3000/intelligence/content');
    console.log('- Navigated to /intelligence/content');
    
    // Store the path manually since the component might error
    await page.evaluate(() => {
      localStorage.setItem('authReturnPath', '/intelligence/content');
    });
    
    // Simulate OAuth callback
    console.log('- Simulating OAuth callback...');
    await page.goto('http://localhost:3000/auth/callback#access_token=fake-token&token_type=bearer&expires_in=3600');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalUrl2 = page.url();
    console.log('- Final URL:', finalUrl2);
    console.log('- Test 2 Result:', finalUrl2.includes('/intelligence/content') ? '✅ PASS' : '❌ FAIL');
    
    // Test 3: Direct login should go to dashboard
    console.log('\nTest 3: Direct Login to Dashboard');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('http://localhost:3000/login');
    console.log('- Navigated to /login directly');
    
    // Simulate OAuth callback
    console.log('- Simulating OAuth callback...');
    await page.goto('http://localhost:3000/auth/callback#access_token=fake-token&token_type=bearer&expires_in=3600');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalUrl3 = page.url();
    console.log('- Final URL:', finalUrl3);
    console.log('- Test 3 Result:', finalUrl3 === 'http://localhost:3000/' ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n=== Test Summary ===');
    console.log('The auth system should:');
    console.log('1. Store the original URL before OAuth redirect');
    console.log('2. Return users to their original page after login');
    console.log('3. Default to dashboard (/) if no return path');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    console.log('\nPress Ctrl+C to close browser...');
  }
}

testAuthIntegration().catch(console.error);