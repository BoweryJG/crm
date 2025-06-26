#!/bin/bash

# YOUR ACTUAL CORRECT API KEY
API_KEY="VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf"
CLIENT_ID="upfQ4yuxVlD9g9AUwDhx"

echo "🎵 FREESOUND API - WITH THE CORRECT FUCKING KEY!"
echo "API Key: $API_KEY"
echo ""

mkdir -p public/sounds/api-downloads

# Test the API
echo "Testing API..."
response=$(curl -s "https://freesound.org/apiv2/search/text/?query=click&token=${API_KEY}&page_size=3")
echo $response | jq .

# If it works, download sounds
if [[ ! "$response" =~ "Invalid token" ]]; then
  echo -e "\n✅ API WORKING! Downloading sounds..."
  
  # Download sounds
  sounds=("click" "button" "notification" "success" "error" "hover" "toggle" "radar" "warning")
  
  for query in "${sounds[@]}"; do
    echo -e "\n🔍 Searching for: $query"
    
    # Get search results
    result=$(curl -s "https://freesound.org/apiv2/search/text/?query=${query}&token=${API_KEY}&fields=id,name,username,previews&page_size=1")
    
    # Extract data
    sound_name=$(echo $result | jq -r '.results[0].name' 2>/dev/null)
    preview_url=$(echo $result | jq -r '.results[0].previews."preview-hq-mp3"' 2>/dev/null)
    
    if [ "$preview_url" != "null" ] && [ ! -z "$preview_url" ]; then
      echo "Found: $sound_name"
      echo "Downloading..."
      
      # Download with token in URL
      curl -L -o "public/sounds/api-downloads/${query}.mp3" "${preview_url}&token=${API_KEY}"
      
      size=$(stat -f%z "public/sounds/api-downloads/${query}.mp3" 2>/dev/null || stat -c%s "public/sounds/api-downloads/${query}.mp3")
      echo "✅ Downloaded: ${query}.mp3 (${size} bytes)"
    fi
    
    sleep 1
  done
  
  echo -e "\n📁 Downloaded files:"
  ls -lh public/sounds/api-downloads/
  
  # Copy to CRM locations
  echo -e "\n🔧 Organizing..."
  cp public/sounds/api-downloads/click.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
  cp public/sounds/api-downloads/notification.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
  cp public/sounds/api-downloads/error.mp3 public/sounds/core/notification-error.mp3 2>/dev/null
  cp public/sounds/api-downloads/radar.mp3 public/sounds/themes/f16-viper/f16-radar-ping.mp3 2>/dev/null
  
  echo "✅ ALL DONE!"
else
  echo "❌ API still not working"
fi