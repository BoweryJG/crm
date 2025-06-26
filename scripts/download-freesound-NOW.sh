#!/bin/bash

# YOUR ACTUAL FUCKING CREDENTIALS
CLIENT_ID="upfQ4yuxVlD9g9AUwDhx"
API_KEY="VkYQvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf"

echo "🎵 DOWNLOADING SOUNDS WITH YOUR REAL API KEY"
echo "Client ID: $CLIENT_ID"
echo "API Key: $API_KEY"
echo ""

# Create directories
mkdir -p public/sounds/freesound/{ui,notifications,aviation}

# Test the API first
echo "Testing API..."
curl -s "https://freesound.org/apiv2/search/text/?query=click&token=$API_KEY" | jq .

# Download sounds using the API
echo -e "\n📥 Downloading UI sounds..."

# Search and download
sounds=(
  "click:ui-click-1"
  "button:ui-click-2"
  "notification:notification-1"
  "success:success-1"
  "error:error-1"
  "radar:radar-1"
  "warning:warning-1"
)

for item in "${sounds[@]}"; do
  IFS=':' read -r query filename <<< "$item"
  echo -e "\nSearching for: $query"
  
  # Get sound data
  result=$(curl -s "https://freesound.org/apiv2/search/text/?query=$query&token=$API_KEY&fields=id,name,previews&page_size=1")
  
  # Extract preview URL
  preview_url=$(echo $result | jq -r '.results[0].previews."preview-hq-mp3"' 2>/dev/null)
  
  if [ "$preview_url" != "null" ] && [ ! -z "$preview_url" ]; then
    echo "Found sound, downloading..."
    curl -L -o "public/sounds/freesound/ui/${filename}.mp3" "${preview_url}?token=$API_KEY"
    echo "✅ Downloaded: ${filename}.mp3"
  else
    echo "❌ No results for: $query"
    echo "Response: $result"
  fi
  
  sleep 1
done

echo -e "\n✅ DONE! Check public/sounds/freesound/"
ls -la public/sounds/freesound/ui/