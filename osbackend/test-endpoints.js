// Simple test script for CRM endpoints
// File: osbackend/test-endpoints.js

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/crm';

// Test functions
async function testHealthCheck() {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testValidateAccess() {
  try {
    console.log('🔍 Testing access validation...');
    const response = await axios.post(`${BASE_URL}/repx/validate-access`, {
      userTier: 'professional',
      feature: 'emails',
      usage: { emails: 150 }
    });
    console.log('✅ Access validation passed:', response.data);
  } catch (error) {
    console.error('❌ Access validation failed:', error.response?.data || error.message);
  }
}

async function testEmailSend() {
  try {
    console.log('🔍 Testing email send...');
    const response = await axios.post(`${BASE_URL}/email/send`, {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test email from the CRM system.'
    });
    console.log('✅ Email send passed:', response.data);
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.data || error.message);
  }
}

async function testPrompts() {
  try {
    console.log('🔍 Testing prompts list...');
    const response = await axios.get(`${BASE_URL}/prompts`);
    console.log('✅ Prompts list passed:', response.data);
  } catch (error) {
    console.error('❌ Prompts list failed:', error.response?.data || error.message);
  }
}

async function testPromptUsage() {
  try {
    console.log('🔍 Testing prompt usage tracking...');
    const response = await axios.post(`${BASE_URL}/prompts/email-follow-up/increment-usage`, {
      userId: 'test-user-123',
      metadata: { source: 'test' }
    });
    console.log('✅ Prompt usage tracking passed:', response.data);
  } catch (error) {
    console.error('❌ Prompt usage tracking failed:', error.response?.data || error.message);
  }
}

async function testAutomationStart() {
  try {
    console.log('🔍 Testing automation start...');
    const response = await axios.post(`${BASE_URL}/automation/start`, {
      workflow_id: 'welcome-sequence',
      contact_id: 'contact-123',
      user_id: 'user-123',
      trigger_data: { source: 'signup' },
      config: { delay_minutes: 5, total_steps: 3 }
    });
    console.log('✅ Automation start passed:', response.data);
  } catch (error) {
    console.error('❌ Automation start failed:', error.response?.data || error.message);
  }
}

async function testAutomationCancel() {
  try {
    console.log('🔍 Testing automation cancel...');
    const response = await axios.post(`${BASE_URL}/automation/cancel`, {
      execution_id: 'auto_123_test',
      user_id: 'user-123',
      reason: 'test_cancellation'
    });
    console.log('✅ Automation cancel passed:', response.data);
  } catch (error) {
    console.error('❌ Automation cancel failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting CRM endpoint tests...\n');
  
  await testHealthCheck();
  console.log('');
  
  await testValidateAccess();
  console.log('');
  
  await testEmailSend();
  console.log('');
  
  await testPrompts();
  console.log('');
  
  await testPromptUsage();
  console.log('');
  
  await testAutomationStart();
  console.log('');
  
  await testAutomationCancel();
  
  console.log('\n🏁 All tests completed!');
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:3001/health');
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first with: npm run dev');
    console.error('   Or run: ./start.sh dev\n');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
})();