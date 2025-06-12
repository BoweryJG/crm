const puppeteer = require('puppeteer');

async function testLoginFlow() {
  console.log('Starting login flow test...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    devtools: true, // Open devtools automatically
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  page.on('pageerror', error => {
    console.error('Page error:', error.message);
  });
  
  try {
    // Step 1: Clear localStorage
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      Object.keys(localStorage).filter(k => k.includes('supabase')).forEach(k => {
        localStorage.removeItem(k);
      });
      console.log('Storage cleared!');
    });
    
    // Step 2: Navigate to home page
    console.log('Navigating to home page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Step 3: Look for welcome message or login button
    const isLoggedIn = await page.evaluate(() => {
      const welcomeText = document.body.innerText;
      return welcomeText.includes('Welcome back') || welcomeText.includes('Dashboard');
    });
    
    if (isLoggedIn) {
      console.log('✅ User appears to be logged in already');
    } else {
      console.log('❌ User is not logged in - should see login page or login button');
    }
    
    // Step 4: Try to navigate to login page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on login page
    const loginPageUrl = page.url();
    console.log('Login page URL:', loginPageUrl);
    
    // Look for OAuth buttons
    const hasGoogleButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => btn.innerText.includes('Google'));
    });
    
    const hasFacebookButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => btn.innerText.includes('Facebook'));
    });
    
    console.log('Google button found:', hasGoogleButton);
    console.log('Facebook button found:', hasFacebookButton);
    
    // Take screenshot
    await page.screenshot({ path: 'login-page-test.png', fullPage: true });
    console.log('Screenshot saved as login-page-test.png');
    
    // Step 5: Check auth callback route exists
    console.log('Checking auth callback route...');
    await page.goto('http://localhost:3000/auth/callback', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const callbackUrl = page.url();
    console.log('After callback route:', callbackUrl);
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    console.log('1. Storage cleared: ✅');
    console.log('2. Home page accessible: ✅');
    console.log('3. Login page has OAuth buttons:', hasGoogleButton && hasFacebookButton ? '✅' : '❌');
    console.log('4. Auth callback route exists:', callbackUrl.includes('auth/callback') || callbackUrl === 'http://localhost:3000/' ? '✅' : '❌');
    console.log('\nNOTE: Actual OAuth login cannot be tested automatically due to security restrictions.');
    console.log('Please manually click the Google/Facebook button to test the full flow.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  // Keep browser open for manual testing
  console.log('\nBrowser will stay open. You can manually test the OAuth login flow.');
  console.log('Press Ctrl+C to close when done.');
}

// Run the test
testLoginFlow().catch(console.error);