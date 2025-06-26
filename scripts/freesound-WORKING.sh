#!/bin/bash

# YOUR API KEY
API_KEY="VkYQvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf"

echo "🎵 FREESOUND DOWNLOAD - USING PROPER AUTHENTICATION"
echo ""

mkdir -p public/sounds/freesound-api

# Test the API with proper header
echo "Testing API with Authorization header..."
curl -H "Authorization: Token $API_KEY" "https://freesound.org/apiv2/search/text/?query=click&page_size=1" | jq .

echo -e "\n📥 Downloading sounds..."

# Function to search and download
download_sound() {
  local query=$1
  local filename=$2
  
  echo -e "\n🔍 Searching for: $query"
  
  # Search with Authorization header
  response=$(curl -s -H "Authorization: Token $API_KEY" "https://freesound.org/apiv2/search/text/?query=$query&page_size=1&fields=id,name,username,previews")
  
  # Extract sound info
  sound_id=$(echo $response | jq -r '.results[0].id' 2>/dev/null)
  sound_name=$(echo $response | jq -r '.results[0].name' 2>/dev/null)
  preview_url=$(echo $response | jq -r '.results[0].previews."preview-hq-mp3"' 2>/dev/null)
  
  if [ "$sound_id" != "null" ] && [ ! -z "$sound_id" ]; then
    echo "Found: $sound_name (ID: $sound_id)"
    
    # Download the preview with token
    echo "Downloading..."
    curl -L -H "Authorization: Token $API_KEY" -o "public/sounds/freesound-api/${filename}.mp3" "$preview_url"
    
    if [ -f "public/sounds/freesound-api/${filename}.mp3" ]; then
      size=$(stat -f%z "public/sounds/freesound-api/${filename}.mp3" 2>/dev/null || stat -c%s "public/sounds/freesound-api/${filename}.mp3")
      echo "✅ Downloaded: ${filename}.mp3 (${size} bytes)"
    fi
  else
    echo "❌ No results found"
  fi
  
  sleep 1
}

# Download various sounds
download_sound "click" "ui-click-1"
download_sound "button press" "ui-click-2"
download_sound "notification" "notification-1"
download_sound "success chime" "success-1"
download_sound "error beep" "error-1"
download_sound "hover" "hover-1"
download_sound "toggle switch" "toggle-1"
download_sound "radar ping" "radar-1"
download_sound "warning alarm" "warning-1"

echo -e "\n📁 Downloaded files:"
ls -lh public/sounds/freesound-api/

# Copy to CRM directories
echo -e "\n🔧 Organizing for CRM..."
cp public/sounds/freesound-api/ui-click-1.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
cp public/sounds/freesound-api/ui-click-2.mp3 public/sounds/core/ui-click-secondary.mp3 2>/dev/null
cp public/sounds/freesound-api/notification-1.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
cp public/sounds/freesound-api/error-1.mp3 public/sounds/core/notification-error.mp3 2>/dev/null
cp public/sounds/freesound-api/radar-1.mp3 public/sounds/themes/f16-viper/f16-radar-ping.mp3 2>/dev/null

echo "✅ FUCKING DONE!"