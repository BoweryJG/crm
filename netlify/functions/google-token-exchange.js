exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const { code, redirect_uri } = body;

  if (!code || !redirect_uri) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }

  try {
    // Log for debugging (remove in production)
    console.log('Token exchange request:', {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ? 'present' : 'missing',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ? 'present' : 'missing',
      code: code ? 'present' : 'missing',
      redirect_uri
    });

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '', // Server-side only
        code,
        grant_type: 'authorization_code',
        redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return {
        statusCode: tokenResponse.status,
        body: JSON.stringify({ 
          error: tokenData.error || 'Token exchange failed',
          error_description: tokenData.error_description 
        })
      };
    }

    // Return the tokens to the client
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};