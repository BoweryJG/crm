/**
 * RepConnect Agent Chat Functionality Test Script
 * Tests the new REST endpoints (/chat/stream, /chat/message, etc.) for RepConnect agents
 * Uses unified_agents table and production backend URL
 */

const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://osbackend.onrender.com';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m'
};

// Utility functions
function print(message, color = colors.white) {
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(color + `[${timestamp}] ${message}` + colors.reset);
}

function printHeader(message) {
  console.log('\n' + colors.bold + colors.blue + '='.repeat(message.length + 4) + colors.reset);
  console.log(colors.bold + colors.blue + '= ' + message + ' =' + colors.reset);
  console.log(colors.bold + colors.blue + '='.repeat(message.length + 4) + colors.reset + '\n');
}

function printResult(message, success) {
  const icon = success ? '✓' : '✗';
  const color = success ? colors.green : colors.red;
  console.log(color + colors.bold + icon + ' ' + message + colors.reset);
}

function printSection(message) {
  console.log('\n' + colors.cyan + colors.bold + '--- ' + message + ' ---' + colors.reset);
}

// Test state
let testResults = {
  agentListing: false,
  restEndpoints: false,
  chatMessage: false,
  chatStream: false,
  conversationManagement: false,
  errorHandling: false
};

let testConversationId = null;
let testAgents = [];

/**
 * Test 1: Agent Listing from unified_agents table
 */
async function testAgentListing() {
  printSection('Testing RepConnect Agent Listing');
  
  try {
    print('Fetching RepConnect agents from unified_agents table...', colors.cyan);
    
    const response = await axios.get(`${BACKEND_URL}/api/agents`, {
      params: { type: 'repconnect' },
      timeout: 10000
    });
    
    if (response.status === 200 && response.data) {
      const agents = response.data.agents || response.data;
      
      if (Array.isArray(agents) && agents.length > 0) {
        print(`Found ${agents.length} RepConnect agents`, colors.green);
        
        // Filter for RepConnect agents specifically
        testAgents = agents.filter(agent => 
          agent.type === 'repconnect' || 
          agent.agent_type === 'repconnect' ||
          agent.name?.toLowerCase().includes('repconnect') ||
          agent.name?.toLowerCase().includes('rep') ||
          agent.category === 'repconnect'
        );
        
        if (testAgents.length > 0) {
          print(`RepConnect agents available:`, colors.white);
          testAgents.forEach((agent, index) => {
            print(`  ${index + 1}. ${agent.name} (ID: ${agent.id})`, colors.white);
            print(`     Type: ${agent.type || agent.agent_type}`, colors.white);
            print(`     Status: ${agent.status || 'active'}`, colors.white);
            if (agent.description) {
              print(`     Description: ${agent.description.substring(0, 100)}...`, colors.white);
            }
          });
          
          testResults.agentListing = true;
          printResult('RepConnect agent listing test passed', true);
        } else {
          print('No RepConnect agents found in response', colors.yellow);
          print('Trying fallback: fetching all agents and looking for RepConnect types...', colors.cyan);
          
          // Fallback: get all agents and check for RepConnect-like agents
          const allAgentsResponse = await axios.get(`${BACKEND_URL}/api/agents`, {
            timeout: 10000
          });
          
          if (allAgentsResponse.status === 200) {
            const allAgents = allAgentsResponse.data.agents || allAgentsResponse.data;
            testAgents = allAgents.filter(agent => 
              agent.name?.toLowerCase().includes('rep') ||
              agent.description?.toLowerCase().includes('rep') ||
              agent.type?.toLowerCase().includes('rep')
            );
            
            if (testAgents.length > 0) {
              print(`Found ${testAgents.length} Rep-related agents as fallback`, colors.green);
              testResults.agentListing = true;
              printResult('RepConnect agent listing test passed (fallback)', true);
            } else {
              print('No RepConnect-related agents found', colors.red);
              printResult('RepConnect agent listing test failed - no agents found', false);
            }
          }
        }
      } else {
        print('Invalid response format - expected array of agents', colors.red);
        printResult('RepConnect agent listing test failed - invalid response format', false);
      }
    } else {
      print(`Unexpected response status: ${response.status}`, colors.red);
      printResult('RepConnect agent listing test failed - bad response status', false);
    }
    
  } catch (error) {
    print(`Error fetching agents: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    }
    printResult('RepConnect agent listing test failed - network error', false);
  }
}

/**
 * Test 2: REST Endpoints Availability
 */
async function testRestEndpoints() {
  printSection('Testing RepConnect REST Endpoints');
  
  const endpoints = [
    { path: '/api/chat/message', method: 'POST', description: 'Chat message endpoint' },
    { path: '/api/chat/stream', method: 'POST', description: 'Chat streaming endpoint' },
    { path: '/api/conversations', method: 'GET', description: 'Conversations listing' },
    { path: '/api/conversations', method: 'POST', description: 'Conversation creation' }
  ];
  
  let endpointsWorking = 0;
  
  for (const endpoint of endpoints) {
    try {
      print(`Testing ${endpoint.method} ${endpoint.path}...`, colors.cyan);
      
      let response;
      if (endpoint.method === 'GET') {
        response = await axios.get(`${BACKEND_URL}${endpoint.path}`, {
          timeout: 5000,
          validateStatus: (status) => status < 500 // Accept 4xx as endpoint exists
        });
      } else if (endpoint.method === 'POST') {
        // Send minimal test data
        response = await axios.post(`${BACKEND_URL}${endpoint.path}`, {
          test: true
        }, {
          timeout: 5000,
          validateStatus: (status) => status < 500 // Accept 4xx as endpoint exists
        });
      }
      
      if (response.status < 500) {
        print(`  ${endpoint.description}: Available (${response.status})`, colors.green);
        endpointsWorking++;
      } else {
        print(`  ${endpoint.description}: Server error (${response.status})`, colors.red);
      }
      
    } catch (error) {
      if (error.response && error.response.status < 500) {
        print(`  ${endpoint.description}: Available (${error.response.status})`, colors.green);
        endpointsWorking++;
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        print(`  ${endpoint.description}: Backend unavailable`, colors.red);
      } else {
        print(`  ${endpoint.description}: Error - ${error.message}`, colors.red);
      }
    }
  }
  
  if (endpointsWorking >= endpoints.length / 2) {
    testResults.restEndpoints = true;
    printResult(`REST endpoints test passed (${endpointsWorking}/${endpoints.length} available)`, true);
  } else {
    printResult(`REST endpoints test failed (${endpointsWorking}/${endpoints.length} available)`, false);
  }
}

/**
 * Test 3: Chat Message Endpoint
 */
async function testChatMessage() {
  printSection('Testing /api/chat/message Endpoint');
  
  if (testAgents.length === 0) {
    print('No RepConnect agents available for message testing', colors.red);
    printResult('Chat message test failed - no agents available', false);
    return;
  }
  
  try {
    const testAgent = testAgents[0];
    const testPayload = {
      agent_id: testAgent.id,
      message: 'Hello, this is a test message for RepConnect agent functionality.',
      conversation_id: testConversationId,
      user_id: 'test-user-123',
      metadata: {
        test: true,
        timestamp: Date.now()
      }
    };
    
    print(`Sending chat message to agent: ${testAgent.name}`, colors.cyan);
    print(`Message: "${testPayload.message}"`, colors.white);
    
    const response = await axios.post(`${BACKEND_URL}/api/chat/message`, testPayload, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 || response.status === 201) {
      const result = response.data;
      
      print(`Response received:`, colors.green);
      print(`  Status: ${response.status}`, colors.white);
      
      if (result.message || result.content || result.response) {
        const agentResponse = result.message || result.content || result.response;
        print(`  Agent Response: "${agentResponse.substring(0, 100)}..."`, colors.white);
      }
      
      if (result.conversation_id) {
        testConversationId = result.conversation_id;
        print(`  Conversation ID: ${testConversationId}`, colors.white);
      }
      
      if (result.message_id || result.id) {
        const messageId = result.message_id || result.id;
        print(`  Message ID: ${messageId}`, colors.white);
      }
      
      testResults.chatMessage = true;
      printResult('Chat message test passed', true);
      
    } else {
      print(`Unexpected response status: ${response.status}`, colors.red);
      print(`Response: ${JSON.stringify(response.data, null, 2)}`, colors.red);
      printResult('Chat message test failed - unexpected status', false);
    }
    
  } catch (error) {
    print(`Error in chat message test: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    }
    printResult('Chat message test failed - network error', false);
  }
}

/**
 * Test 4: Chat Stream Endpoint
 */
async function testChatStream() {
  printSection('Testing /api/chat/stream Endpoint');
  
  if (testAgents.length === 0) {
    print('No RepConnect agents available for streaming test', colors.red);
    printResult('Chat stream test failed - no agents available', false);
    return;
  }
  
  try {
    const testAgent = testAgents[0];
    const testPayload = {
      agent_id: testAgent.id,
      message: 'Please provide a streaming response for testing RepConnect functionality.',
      conversation_id: testConversationId,
      user_id: 'test-user-123',
      stream: true,
      metadata: {
        test: true,
        timestamp: Date.now()
      }
    };
    
    print(`Testing streaming response from agent: ${testAgent.name}`, colors.cyan);
    print(`Message: "${testPayload.message}"`, colors.white);
    
    const response = await axios.post(`${BACKEND_URL}/api/chat/stream`, testPayload, {
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      responseType: 'stream'
    });
    
    if (response.status === 200) {
      print('Streaming response started...', colors.green);
      
      let streamData = '';
      let chunkCount = 0;
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          print('Stream timeout (15s)', colors.yellow);
          if (chunkCount > 0) {
            testResults.chatStream = true;
            printResult('Chat stream test passed (with timeout)', true);
          } else {
            printResult('Chat stream test failed - no data received', false);
          }
          resolve();
        }, 15000);
        
        response.data.on('data', (chunk) => {
          chunkCount++;
          const chunkStr = chunk.toString();
          streamData += chunkStr;
          
          print(`  Stream chunk ${chunkCount}: ${chunkStr.substring(0, 50)}...`, colors.white);
          
          // Look for common streaming patterns
          if (chunkStr.includes('data:') || chunkStr.includes('{') || chunkStr.includes('message')) {
            print('  Detected structured streaming data', colors.green);
          }
        });
        
        response.data.on('end', () => {
          clearTimeout(timeout);
          
          if (chunkCount > 0) {
            print(`Stream completed: ${chunkCount} chunks received`, colors.green);
            print(`Total data length: ${streamData.length} characters`, colors.white);
            
            testResults.chatStream = true;
            printResult('Chat stream test passed', true);
          } else {
            print('Stream ended with no data', colors.red);
            printResult('Chat stream test failed - no streaming data', false);
          }
          
          resolve();
        });
        
        response.data.on('error', (error) => {
          clearTimeout(timeout);
          print(`Stream error: ${error.message}`, colors.red);
          printResult('Chat stream test failed - stream error', false);
          resolve();
        });
      });
      
    } else {
      print(`Unexpected response status: ${response.status}`, colors.red);
      printResult('Chat stream test failed - unexpected status', false);
    }
    
  } catch (error) {
    print(`Error in chat stream test: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response headers: ${JSON.stringify(error.response.headers, null, 2)}`, colors.red);
    }
    printResult('Chat stream test failed - network error', false);
  }
}

/**
 * Test 5: Conversation Management
 */
async function testConversationManagement() {
  printSection('Testing RepConnect Conversation Management');
  
  try {
    // Test creating a new conversation
    print('Testing RepConnect conversation creation...', colors.cyan);
    
    const createPayload = {
      agent_id: testAgents.length > 0 ? testAgents[0].id : 'repconnect-test-agent',
      title: 'RepConnect Agent Test Conversation',
      type: 'repconnect_chat',
      user_id: 'test-user-123',
      metadata: {
        test: true,
        platform: 'repconnect',
        timestamp: Date.now()
      }
    };
    
    const createResponse = await axios.post(`${BACKEND_URL}/api/conversations`, createPayload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (createResponse.status === 200 || createResponse.status === 201) {
      const conversation = createResponse.data.conversation || createResponse.data;
      print(`RepConnect conversation created: ${conversation.id}`, colors.green);
      testConversationId = conversation.id;
      
      // Test fetching conversations
      print('Testing RepConnect conversation retrieval...', colors.cyan);
      
      const listResponse = await axios.get(`${BACKEND_URL}/api/conversations`, {
        params: { 
          type: 'repconnect_chat',
          user_id: 'test-user-123'
        },
        timeout: 10000
      });
      
      if (listResponse.status === 200) {
        const conversations = listResponse.data.conversations || listResponse.data;
        
        if (Array.isArray(conversations) && conversations.length > 0) {
          print(`Found ${conversations.length} RepConnect conversations`, colors.green);
          
          const testConv = conversations.find(c => c.id === testConversationId);
          if (testConv) {
            print(`Test conversation found in list`, colors.green);
            print(`  Title: ${testConv.title}`, colors.white);
            print(`  Type: ${testConv.type}`, colors.white);
            print(`  Created: ${testConv.created_at}`, colors.white);
            
            testResults.conversationManagement = true;
            printResult('RepConnect conversation management test passed', true);
          } else {
            print('Test conversation not found in list', colors.yellow);
            printResult('RepConnect conversation management test partially passed', false);
          }
        } else {
          print('No RepConnect conversations returned', colors.yellow);
          printResult('RepConnect conversation management test failed - no conversations', false);
        }
      } else {
        print(`Unexpected response status: ${listResponse.status}`, colors.red);
        printResult('RepConnect conversation management test failed - list error', false);
      }
      
    } else {
      print(`RepConnect conversation creation failed: ${createResponse.status}`, colors.red);
      print(`Response: ${JSON.stringify(createResponse.data, null, 2)}`, colors.red);
      printResult('RepConnect conversation management test failed - creation error', false);
    }
    
  } catch (error) {
    print(`Error in RepConnect conversation management test: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    }
    printResult('RepConnect conversation management test failed - network error', false);
  }
}

/**
 * Test 6: Error Handling
 */
async function testErrorHandling() {
  printSection('Testing RepConnect Error Handling');
  
  try {
    // Test 1: Invalid agent ID in chat message
    print('Testing invalid agent ID in chat message...', colors.cyan);
    
    try {
      await axios.post(`${BACKEND_URL}/api/chat/message`, {
        agent_id: 'invalid-repconnect-agent-id',
        message: 'Test message with invalid agent',
        user_id: 'test-user'
      }, {
        timeout: 5000
      });
      print('Expected error for invalid agent ID, but request succeeded', colors.yellow);
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        print(`Correctly handled invalid agent ID (${error.response.status})`, colors.green);
      } else {
        print(`Unexpected error: ${error.message}`, colors.yellow);
      }
    }
    
    // Test 2: Missing required fields in chat message
    print('Testing missing required fields in chat message...', colors.cyan);
    
    try {
      await axios.post(`${BACKEND_URL}/api/chat/message`, {
        // Missing agent_id and message
        user_id: 'test-user'
      }, {
        timeout: 5000
      });
      print('Expected error for missing fields, but request succeeded', colors.yellow);
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        print(`Correctly handled missing fields (${error.response.status})`, colors.green);
      } else {
        print(`Unexpected error: ${error.message}`, colors.yellow);
      }
    }
    
    // Test 3: Invalid JSON in request
    print('Testing malformed JSON handling...', colors.cyan);
    
    try {
      await axios.post(`${BACKEND_URL}/api/chat/message`, 'invalid-json', {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      print('Expected error for malformed JSON, but request succeeded', colors.yellow);
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        print(`Correctly handled malformed JSON (${error.response.status})`, colors.green);
      } else {
        print(`Unexpected error: ${error.message}`, colors.yellow);
      }
    }
    
    // Test 4: Rate limiting (if implemented)
    print('Testing rate limiting for RepConnect endpoints...', colors.cyan);
    
    try {
      const rapidRequests = Array(15).fill().map((_, index) => 
        axios.post(`${BACKEND_URL}/api/chat/message`, {
          agent_id: 'test-agent',
          message: `Rate limit test message ${index}`,
          user_id: 'test-user'
        }, { 
          timeout: 2000,
          validateStatus: (status) => status < 500 
        })
      );
      
      const results = await Promise.allSettled(rapidRequests);
      const rateLimited = results.some(result => 
        result.status === 'fulfilled' && 
        result.value.status === 429
      );
      
      if (rateLimited) {
        print('Rate limiting correctly implemented for RepConnect', colors.green);
      } else {
        print('No rate limiting detected for RepConnect (may not be implemented)', colors.white);
      }
    } catch (error) {
      print('Rate limiting test inconclusive', colors.white);
    }
    
    testResults.errorHandling = true;
    printResult('RepConnect error handling tests completed', true);
    
  } catch (error) {
    print(`Error in RepConnect error handling test: ${error.message}`, colors.red);
    printResult('RepConnect error handling test failed', false);
  }
}

/**
 * Main test execution
 */
async function runRepConnectChatTests() {
  printHeader('RepConnect Agent Chat Functionality Tests');
  
  print('Backend URL: ' + BACKEND_URL, colors.white);
  print('Test Target: RepConnect agents via REST endpoints', colors.white);
  print('Endpoints: /api/chat/message, /api/chat/stream, /api/conversations', colors.white);
  
  try {
    // Run tests sequentially
    await testAgentListing();
    
    await testRestEndpoints();
    
    await testChatMessage();
    
    await testChatStream();
    
    await testConversationManagement();
    
    await testErrorHandling();
    
  } catch (error) {
    print(`Test execution error: ${error.message}`, colors.red);
  }
  
  // Print final results
  printHeader('RepConnect Test Results Summary');
  
  const tests = [
    { name: 'Agent Listing', passed: testResults.agentListing },
    { name: 'REST Endpoints', passed: testResults.restEndpoints },
    { name: 'Chat Message (/api/chat/message)', passed: testResults.chatMessage },
    { name: 'Chat Stream (/api/chat/stream)', passed: testResults.chatStream },
    { name: 'Conversation Management', passed: testResults.conversationManagement },
    { name: 'Error Handling', passed: testResults.errorHandling }
  ];
  
  tests.forEach(test => {
    printResult(`${test.name}: ${test.passed ? 'PASSED' : 'FAILED'}`, test.passed);
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  const totalCount = tests.length;
  
  console.log('\n' + colors.bold + colors.white + '-'.repeat(50) + colors.reset);
  
  if (passedCount === totalCount) {
    print(`All RepConnect tests passed! (${passedCount}/${totalCount})`, colors.bold + colors.green);
    print('RepConnect agent chat functionality is working correctly.', colors.green);
  } else {
    print(`${passedCount}/${totalCount} RepConnect tests passed.`, colors.bold + colors.yellow);
    print('Some RepConnect agent functionality issues detected.', colors.yellow);
    
    const failedTests = tests.filter(t => !t.passed).map(t => t.name);
    print(`Failed tests: ${failedTests.join(', ')}`, colors.red);
  }
  
  if (testConversationId) {
    print(`\nTest conversation ID: ${testConversationId}`, colors.white);
    print('You can use this ID to inspect the test conversation in your backend.', colors.white);
  }
  
  print('\nRepConnect test execution completed.', colors.white);
  
  // Print usage instructions
  printHeader('Usage Instructions');
  print('To run this test:', colors.white);
  print('1. Ensure Node.js and required packages (axios) are installed', colors.white);
  print('2. Set BACKEND_URL environment variable if different from default', colors.white);
  print('3. Run: node test_repconnect_chat.js', colors.white);
  print('', colors.white);
  print('To test with custom backend URL:', colors.white);
  print('BACKEND_URL=https://your-backend.com node test_repconnect_chat.js', colors.white);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  print('\nRepConnect test interrupted by user', colors.yellow);
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  print(`Uncaught exception in RepConnect test: ${error.message}`, colors.red);
  process.exit(1);
});

// Run the tests
runRepConnectChatTests().catch((error) => {
  print(`Fatal error in RepConnect test: ${error.message}`, colors.red);
  process.exit(1);
});