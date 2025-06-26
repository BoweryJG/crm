#!/bin/bash

API_KEY="VkYQvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf"
CLIENT_ID="upfQ4yuxVlD9g9AUwDhx"

echo "🔧 DEBUGGING FREESOUND API CONNECTION"
echo "Client ID: $CLIENT_ID"
echo "API Key: $API_KEY"
echo ""

# Try different methods
echo "Method 1: Token as parameter"
curl -v "https://freesound.org/apiv2/search/text/?query=click&token=${API_KEY}&format=json" 2>&1 | grep -E "(HTTP|detail|results)"

echo -e "\n\nMethod 2: Authorization header with 'Token'"
curl -v -H "Authorization: Token ${API_KEY}" "https://freesound.org/apiv2/search/text/?query=click&format=json" 2>&1 | grep -E "(HTTP|detail|results)"

echo -e "\n\nMethod 3: Authorization header with 'Bearer'"  
curl -v -H "Authorization: Bearer ${API_KEY}" "https://freesound.org/apiv2/search/text/?query=click&format=json" 2>&1 | grep -E "(HTTP|detail|results)"

echo -e "\n\nMethod 4: Get a specific sound by ID"
curl "https://freesound.org/apiv2/sounds/256113/?token=${API_KEY}"

echo -e "\n\nMethod 5: Try with client_id and secret"
curl "https://freesound.org/apiv2/search/text/?query=click&client_id=${CLIENT_ID}&client_secret=${API_KEY}"