#!/bin/bash

echo "🎵 Downloading sounds from Freesound.org..."
echo "Using direct preview URLs (no API key required)"

# Create directories
mkdir -p public/sounds/freesound/{ui,notifications,aviation,crm}

# Function to download with curl and check file size
download_sound() {
    local url=$1
    local output=$2
    local name=$3
    
    echo -n "Downloading $name... "
    curl -s -L -o "$output" "$url"
    
    if [ -f "$output" ]; then
        size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
        if [ "$size" -gt 1000 ]; then
            echo "✅ Success ($size bytes)"
            return 0
        else
            rm "$output"
            echo "❌ Failed (too small)"
            return 1
        fi
    else
        echo "❌ Failed (no file)"
        return 1
    fi
}

echo -e "\n📁 Downloading UI Click Sounds..."
# These are actual working Freesound preview URLs
download_sound "https://freesound.org/data/previews/256/256113_3263906-lq.mp3" "public/sounds/freesound/ui/click-soft.mp3" "Soft click"
download_sound "https://freesound.org/data/previews/191/191611_2437358-lq.mp3" "public/sounds/freesound/ui/click-sharp.mp3" "Sharp click"
download_sound "https://freesound.org/data/previews/220/220173_4012250-lq.mp3" "public/sounds/freesound/ui/click-minimal.mp3" "Minimal click"
download_sound "https://freesound.org/data/previews/244/244252_4486164-lq.mp3" "public/sounds/freesound/ui/click-tech.mp3" "Tech click"

echo -e "\n📁 Downloading Hover Sounds..."
download_sound "https://freesound.org/data/previews/334/334239_5137451-lq.mp3" "public/sounds/freesound/ui/hover-soft.mp3" "Soft hover"
download_sound "https://freesound.org/data/previews/266/266016_5064783-lq.mp3" "public/sounds/freesound/ui/hover-sweep.mp3" "Sweep hover"

echo -e "\n📁 Downloading Toggle Sounds..."
download_sound "https://freesound.org/data/previews/351/351563_5665772-lq.mp3" "public/sounds/freesound/ui/toggle-on.mp3" "Toggle on"
download_sound "https://freesound.org/data/previews/321/321103_2776656-lq.mp3" "public/sounds/freesound/ui/toggle-switch.mp3" "Switch toggle"

echo -e "\n📁 Downloading Notification Sounds..."
download_sound "https://freesound.org/data/previews/277/277403_5061990-lq.mp3" "public/sounds/freesound/notifications/success.mp3" "Success notification"
download_sound "https://freesound.org/data/previews/171/171670_2437358-lq.mp3" "public/sounds/freesound/notifications/error.mp3" "Error notification"
download_sound "https://freesound.org/data/previews/411/411090_5121508-lq.mp3" "public/sounds/freesound/notifications/alert.mp3" "Alert sound"
download_sound "https://freesound.org/data/previews/322/322930_5625498-lq.mp3" "public/sounds/freesound/notifications/message.mp3" "Message notification"

echo -e "\n📁 Downloading Aviation Theme Sounds..."
download_sound "https://freesound.org/data/previews/369/369955_6870638-lq.mp3" "public/sounds/freesound/aviation/radar-ping.mp3" "Radar ping"
download_sound "https://freesound.org/data/previews/235/235911_2523779-lq.mp3" "public/sounds/freesound/aviation/radar-sweep.mp3" "Radar sweep"
download_sound "https://freesound.org/data/previews/242/242501_2304554-lq.mp3" "public/sounds/freesound/aviation/warning-beep.mp3" "Warning beep"
download_sound "https://freesound.org/data/previews/316/316609_52661-lq.mp3" "public/sounds/freesound/aviation/button-press.mp3" "Cockpit button"
download_sound "https://freesound.org/data/previews/399/399934_1661766-lq.mp3" "public/sounds/freesound/aviation/alert-tone.mp3" "Alert tone"

echo -e "\n📁 Downloading CRM Sounds..."
download_sound "https://freesound.org/data/previews/316/316808_5123451-lq.mp3" "public/sounds/freesound/crm/phone-ring.mp3" "Phone ring"
download_sound "https://freesound.org/data/previews/263/263133_3544020-lq.mp3" "public/sounds/freesound/crm/call-connect.mp3" "Call connect"
download_sound "https://freesound.org/data/previews/394/394903_1676145-lq.mp3" "public/sounds/freesound/crm/call-end.mp3" "Call end"
download_sound "https://freesound.org/data/previews/234/234524_4019029-lq.mp3" "public/sounds/freesound/crm/message-sent.mp3" "Message sent"
download_sound "https://freesound.org/data/previews/362/362204_6103172-lq.mp3" "public/sounds/freesound/crm/save-success.mp3" "Save success"

echo -e "\n📊 Checking downloaded files..."
echo -e "\nUI Sounds:"
ls -lh public/sounds/freesound/ui/*.mp3 2>/dev/null | awk '{print $9 ": " $5}'

echo -e "\nNotification Sounds:"
ls -lh public/sounds/freesound/notifications/*.mp3 2>/dev/null | awk '{print $9 ": " $5}'

echo -e "\nAviation Sounds:"
ls -lh public/sounds/freesound/aviation/*.mp3 2>/dev/null | awk '{print $9 ": " $5}'

echo -e "\nCRM Sounds:"
ls -lh public/sounds/freesound/crm/*.mp3 2>/dev/null | awk '{print $9 ": " $5}'

echo -e "\n✅ Download complete! Now run ./scripts/organize-freesound-downloads.sh to organize them."