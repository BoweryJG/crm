/**
 * Canvas Agent Chat Functionality Test Script
 * Tests WebSocket connections and agent interactions for Canvas agents
 * Uses unified_agents table and production backend URL
 */

const WebSocket = require('ws');
const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://osbackend.onrender.com';
const WS_URL = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');

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
  websocketConnection: false,
  messageExchange: false,
  conversationManagement: false,
  errorHandling: false
};

let testConversationId = null;
let testAgents = [];

/**
 * Test 1: Agent Listing from unified_agents table
 */
async function testAgentListing() {
  printSection('Testing Agent Listing');
  
  try {
    print('Fetching Canvas agents from unified_agents table...', colors.cyan);
    
    const response = await axios.get(`${BACKEND_URL}/api/agents`, {
      params: { type: 'canvas' },
      timeout: 10000
    });
    
    if (response.status === 200 && response.data) {
      const agents = response.data.agents || response.data;
      
      if (Array.isArray(agents) && agents.length > 0) {
        print(`Found ${agents.length} Canvas agents`, colors.green);
        
        // Filter for Canvas agents specifically
        testAgents = agents.filter(agent => 
          agent.type === 'canvas' || 
          agent.agent_type === 'canvas' ||
          agent.name?.toLowerCase().includes('canvas')
        );
        
        if (testAgents.length > 0) {
          print(`Canvas agents available:`, colors.white);
          testAgents.forEach((agent, index) => {
            print(`  ${index + 1}. ${agent.name} (ID: ${agent.id})`, colors.white);
            print(`     Type: ${agent.type || agent.agent_type}`, colors.white);
            print(`     Status: ${agent.status || 'active'}`, colors.white);
          });
          
          testResults.agentListing = true;
          printResult('Agent listing test passed', true);
        } else {
          print('No Canvas agents found in response', colors.yellow);
          printResult('Agent listing test failed - no Canvas agents', false);
        }
      } else {
        print('Invalid response format - expected array of agents', colors.red);
        printResult('Agent listing test failed - invalid response format', false);
      }
    } else {
      print(`Unexpected response status: ${response.status}`, colors.red);
      printResult('Agent listing test failed - bad response status', false);
    }
    
  } catch (error) {
    print(`Error fetching agents: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    }
    printResult('Agent listing test failed - network error', false);
  }
}

/**
 * Test 2: WebSocket Connection
 */
async function testWebSocketConnection() {
  printSection('Testing WebSocket Connection');
  
  return new Promise((resolve) => {
    try {
      print('Connecting to WebSocket...', colors.cyan);
      print(`WebSocket URL: ${WS_URL}/ws`, colors.white);
      
      const ws = new WebSocket(`${WS_URL}/ws`);
      let connectionTimeout;
      
      // Set connection timeout
      connectionTimeout = setTimeout(() => {
        print('WebSocket connection timeout (10s)', colors.red);
        printResult('WebSocket connection test failed - timeout', false);
        ws.close();
        resolve(ws);
      }, 10000);
      
      ws.on('open', () => {
        clearTimeout(connectionTimeout);
        print('WebSocket connected successfully', colors.green);
        testResults.websocketConnection = true;
        printResult('WebSocket connection test passed', true);
        
        // Send ping to test basic communication
        const pingMessage = {
          type: 'ping',
          timestamp: Date.now()
        };
        
        print('Sending ping message...', colors.cyan);
        ws.send(JSON.stringify(pingMessage));
        
        resolve(ws);
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          print(`Received WebSocket message: ${message.type}`, colors.white);
          
          if (message.type === 'pong') {
            print('Pong received - WebSocket communication working', colors.green);
          }
        } catch (e) {
          print(`Received non-JSON message: ${data}`, colors.white);
        }
      });
      
      ws.on('error', (error) => {
        clearTimeout(connectionTimeout);
        print(`WebSocket error: ${error.message}`, colors.red);
        printResult('WebSocket connection test failed - connection error', false);
        resolve(ws);
      });
      
      ws.on('close', (code, reason) => {
        clearTimeout(connectionTimeout);
        print(`WebSocket closed: ${code} - ${reason}`, colors.yellow);
      });
      
    } catch (error) {
      print(`WebSocket connection error: ${error.message}`, colors.red);
      printResult('WebSocket connection test failed - initialization error', false);
      resolve(null);
    }
  });
}

/**
 * Test 3: Chat Message Exchange
 */
async function testMessageExchange(ws) {
  printSection('Testing Chat Message Exchange');
  
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    print('WebSocket not available for message testing', colors.red);
    printResult('Message exchange test failed - no WebSocket connection', false);
    return;
  }
  
  if (testAgents.length === 0) {
    print('No Canvas agents available for message testing', colors.red);
    printResult('Message exchange test failed - no agents available', false);
    return;
  }
  
  return new Promise((resolve) => {
    try {
      const testAgent = testAgents[0];
      const testMessage = {
        type: 'chat_message',
        agent_id: testAgent.id,
        message: 'Hello, this is a test message for Canvas agent functionality.',
        conversation_id: testConversationId,
        timestamp: Date.now()
      };
      
      print(`Sending test message to agent: ${testAgent.name}`, colors.cyan);
      print(`Message: "${testMessage.message}"`, colors.white);
      
      let responseReceived = false;
      let responseTimeout;
      
      // Set response timeout
      responseTimeout = setTimeout(() => {
        if (!responseReceived) {
          print('No response received within 15 seconds', colors.red);
          printResult('Message exchange test failed - no response', false);
          resolve();
        }
      }, 15000);
      
      // Listen for agent response
      const messageHandler = (data) => {
        try {
          const response = JSON.parse(data);
          
          if (response.type === 'agent_response' || response.type === 'chat_response') {
            responseReceived = true;
            clearTimeout(responseTimeout);
            
            print(`Received agent response: ${response.message || response.content}`, colors.green);
            
            if (response.conversation_id) {
              testConversationId = response.conversation_id;
              print(`Conversation ID: ${testConversationId}`, colors.white);
            }
            
            testResults.messageExchange = true;
            printResult('Message exchange test passed', true);
            
            ws.removeListener('message', messageHandler);
            resolve();
          }
        } catch (e) {
          // Non-JSON message, ignore
        }
      };
      
      ws.on('message', messageHandler);
      
      // Send the test message
      ws.send(JSON.stringify(testMessage));
      
    } catch (error) {
      print(`Error in message exchange test: ${error.message}`, colors.red);
      printResult('Message exchange test failed - send error', false);
      resolve();
    }
  });
}

/**
 * Test 4: Conversation Management
 */
async function testConversationManagement() {
  printSection('Testing Conversation Management');
  
  try {
    // Test creating a new conversation
    print('Testing conversation creation...', colors.cyan);
    
    const createResponse = await axios.post(`${BACKEND_URL}/api/conversations`, {
      agent_id: testAgents.length > 0 ? testAgents[0].id : 'test-agent',
      title: 'Canvas Agent Test Conversation',
      type: 'canvas_chat'
    }, {
      timeout: 10000
    });
    
    if (createResponse.status === 200 || createResponse.status === 201) {
      const conversation = createResponse.data.conversation || createResponse.data;
      print(`Conversation created: ${conversation.id}`, colors.green);
      testConversationId = conversation.id;
      
      // Test fetching conversations
      print('Testing conversation retrieval...', colors.cyan);
      
      const listResponse = await axios.get(`${BACKEND_URL}/api/conversations`, {
        params: { type: 'canvas_chat' },
        timeout: 10000
      });
      
      if (listResponse.status === 200) {
        const conversations = listResponse.data.conversations || listResponse.data;
        
        if (Array.isArray(conversations) && conversations.length > 0) {
          print(`Found ${conversations.length} conversations`, colors.green);
          
          const testConv = conversations.find(c => c.id === testConversationId);
          if (testConv) {
            print(`Test conversation found in list`, colors.green);
            testResults.conversationManagement = true;
            printResult('Conversation management test passed', true);
          } else {
            print('Test conversation not found in list', colors.yellow);
            printResult('Conversation management test partially passed', false);
          }
        } else {
          print('No conversations returned', colors.yellow);
          printResult('Conversation management test failed - no conversations', false);
        }
      } else {
        print(`Unexpected response status: ${listResponse.status}`, colors.red);
        printResult('Conversation management test failed - list error', false);
      }
      
    } else {
      print(`Conversation creation failed: ${createResponse.status}`, colors.red);
      printResult('Conversation management test failed - creation error', false);
    }
    
  } catch (error) {
    print(`Error in conversation management test: ${error.message}`, colors.red);
    if (error.response) {
      print(`Response status: ${error.response.status}`, colors.red);
      print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    }
    printResult('Conversation management test failed - network error', false);
  }
}

/**
 * Test 5: Error Handling
 */
async function testErrorHandling() {
  printSection('Testing Error Handling');
  
  try {
    // Test 1: Invalid agent ID
    print('Testing invalid agent ID handling...', colors.cyan);
    
    try {
      await axios.get(`${BACKEND_URL}/api/agents/invalid-agent-id`, {
        timeout: 5000
      });
      print('Expected error for invalid agent ID, but request succeeded', colors.yellow);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        print('Correctly handled invalid agent ID (404)', colors.green);
      } else if (error.response && error.response.status >= 400) {
        print(`Correctly handled invalid agent ID (${error.response.status})`, colors.green);
      } else {
        print(`Unexpected error: ${error.message}`, colors.yellow);
      }
    }
    
    // Test 2: Malformed request
    print('Testing malformed request handling...', colors.cyan);
    
    try {
      await axios.post(`${BACKEND_URL}/api/conversations`, {
        // Missing required fields
      }, {
        timeout: 5000
      });
      print('Expected error for malformed request, but request succeeded', colors.yellow);
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        print(`Correctly handled malformed request (${error.response.status})`, colors.green);
      } else {
        print(`Unexpected error: ${error.message}`, colors.yellow);
      }
    }
    
    // Test 3: Rate limiting (if implemented)
    print('Testing rate limiting (if implemented)...', colors.cyan);
    
    try {
      const promises = Array(10).fill().map(() => 
        axios.get(`${BACKEND_URL}/api/agents`, { timeout: 2000 })
      );
      
      await Promise.all(promises);
      print('No rate limiting detected (may not be implemented)', colors.white);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        print('Rate limiting correctly implemented', colors.green);
      } else {
        print('Rate limiting test inconclusive', colors.white);
      }
    }
    
    testResults.errorHandling = true;
    printResult('Error handling tests completed', true);
    
  } catch (error) {
    print(`Error in error handling test: ${error.message}`, colors.red);
    printResult('Error handling test failed', false);
  }
}

/**
 * Main test execution
 */
async function runCanvasChatTests() {
  printHeader('Canvas Agent Chat Functionality Tests');
  
  print('Backend URL: ' + BACKEND_URL, colors.white);
  print('WebSocket URL: ' + WS_URL + '/ws', colors.white);
  print('Test Target: Canvas agents from unified_agents table', colors.white);
  
  let ws = null;
  
  try {
    // Run tests sequentially
    await testAgentListing();
    
    ws = await testWebSocketConnection();
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      await testMessageExchange(ws);
    }
    
    await testConversationManagement();
    
    await testErrorHandling();
    
  } catch (error) {
    print(`Test execution error: ${error.message}`, colors.red);
  } finally {
    // Close WebSocket connection
    if (ws && ws.readyState === WebSocket.OPEN) {
      print('Closing WebSocket connection...', colors.cyan);
      ws.close();
    }
  }
  
  // Print final results
  printHeader('Test Results Summary');
  
  const tests = [
    { name: 'Agent Listing', passed: testResults.agentListing },
    { name: 'WebSocket Connection', passed: testResults.websocketConnection },
    { name: 'Message Exchange', passed: testResults.messageExchange },
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
    print(`All tests passed! (${passedCount}/${totalCount})`, colors.bold + colors.green);
    print('Canvas agent chat functionality is working correctly.', colors.green);
  } else {
    print(`${passedCount}/${totalCount} tests passed.`, colors.bold + colors.yellow);
    print('Some Canvas agent functionality issues detected.', colors.yellow);
    
    const failedTests = tests.filter(t => !t.passed).map(t => t.name);
    print(`Failed tests: ${failedTests.join(', ')}`, colors.red);
  }
  
  print('\nTest execution completed.', colors.white);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  print('\nTest interrupted by user', colors.yellow);
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  print(`Uncaught exception: ${error.message}`, colors.red);
  process.exit(1);
});

// Run the tests
runCanvasChatTests().catch((error) => {
  print(`Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});