#!/bin/bash

# CORRECT API KEY
API_KEY="VkYOvuNCg3QbFskSA8SywWRqtOFTBPCFA0lTywTf"

echo "🎵 FREESOUND DOWNLOAD - FINAL VERSION"
echo ""

mkdir -p public/sounds/freesound-final

# Function to download sound properly
download_sound() {
  local query=$1
  local filename=$2
  
  echo -e "\n🔍 Searching for: $query"
  
  # Search for sounds
  result=$(curl -s "https://freesound.org/apiv2/search/text/?query=${query}&token=${API_KEY}&fields=id,name,username,previews,download&page_size=1&filter=duration:[0.1 TO 5]")
  
  # Extract data
  sound_id=$(echo $result | jq -r '.results[0].id')
  sound_name=$(echo $result | jq -r '.results[0].name')
  preview_hq=$(echo $result | jq -r '.results[0].previews."preview-hq-mp3"')
  
  if [ "$sound_id" != "null" ]; then
    echo "Found: $sound_name (ID: $sound_id)"
    
    # Get full sound details including download URL
    sound_details=$(curl -s "https://freesound.org/apiv2/sounds/${sound_id}/?token=${API_KEY}")
    download_url=$(echo $sound_details | jq -r '.download')
    
    # Try high quality preview first (doesn't need OAuth)
    if [ "$preview_hq" != "null" ]; then
      echo "Downloading high quality preview..."
      curl -L -o "public/sounds/freesound-final/${filename}.mp3" "$preview_hq"
      
      # Check file size
      if [ -f "public/sounds/freesound-final/${filename}.mp3" ]; then
        size=$(stat -f%z "public/sounds/freesound-final/${filename}.mp3" 2>/dev/null || stat -c%s "public/sounds/freesound-final/${filename}.mp3")
        if [ "$size" -gt 10000 ]; then
          echo "✅ Downloaded: ${filename}.mp3 (${size} bytes)"
          return 0
        else
          rm "public/sounds/freesound-final/${filename}.mp3"
        fi
      fi
    fi
    
    # If preview failed, try direct download (requires OAuth usually)
    echo "Trying direct download..."
    curl -L -H "Authorization: Token ${API_KEY}" -o "public/sounds/freesound-final/${filename}.mp3" "${download_url}"
    
    if [ -f "public/sounds/freesound-final/${filename}.mp3" ]; then
      size=$(stat -f%z "public/sounds/freesound-final/${filename}.mp3" 2>/dev/null || stat -c%s "public/sounds/freesound-final/${filename}.mp3")
      if [ "$size" -gt 10000 ]; then
        echo "✅ Downloaded: ${filename}.mp3 (${size} bytes)"
      else
        echo "❌ Download failed - file too small"
        rm "public/sounds/freesound-final/${filename}.mp3"
      fi
    fi
  else
    echo "❌ No results found"
  fi
}

# Download various sounds with better search terms
download_sound "ui button click short" "ui-click-1"
download_sound "interface click" "ui-click-2"
download_sound "notification bell" "notification-1"
download_sound "success chime short" "success-1"
download_sound "error beep short" "error-1"
download_sound "ui hover" "hover-1"
download_sound "toggle switch" "toggle-1"
download_sound "radar beep" "radar-1"
download_sound "warning alarm short" "warning-1"
download_sound "phone ring" "phone-1"
download_sound "message whoosh" "message-1"

echo -e "\n📁 Successfully downloaded files:"
ls -lh public/sounds/freesound-final/

# Copy to CRM directories
echo -e "\n🔧 Organizing for CRM..."
cp public/sounds/freesound-final/ui-click-*.mp3 public/sounds/core/ 2>/dev/null
cp public/sounds/freesound-final/notification-*.mp3 public/sounds/core/ 2>/dev/null
cp public/sounds/freesound-final/success-*.mp3 public/sounds/core/ 2>/dev/null
cp public/sounds/freesound-final/error-*.mp3 public/sounds/core/ 2>/dev/null
cp public/sounds/freesound-final/radar-*.mp3 public/sounds/themes/f16-viper/ 2>/dev/null

echo "✅ FUCKING DONE! CHECK public/sounds/freesound-final/"