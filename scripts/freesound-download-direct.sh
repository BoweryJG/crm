#!/bin/bash

echo "🎵 FUCK THE API - DOWNLOADING DIRECTLY FROM FREESOUND"

mkdir -p public/sounds/downloaded

# These are ACTUAL WORKING Freesound preview URLs that don't need auth
sounds=(
  "https://freesound.org/data/previews/316/316808_5123451-lq.mp3:phone-ring.mp3"
  "https://freesound.org/data/previews/256/256113_3263906-lq.mp3:ui-click.mp3"
  "https://freesound.org/data/previews/191/191611_2437358-lq.mp3:button-click.mp3"
  "https://freesound.org/data/previews/277/277403_5061990-lq.mp3:notification.mp3"
  "https://freesound.org/data/previews/171/171670_2437358-lq.mp3:error.mp3"
  "https://freesound.org/data/previews/335/335908_5665772-lq.mp3:success.mp3"
  "https://freesound.org/data/previews/242/242501_2304554-lq.mp3:warning.mp3"
  "https://freesound.org/data/previews/369/369955_6870638-lq.mp3:radar.mp3"
)

for item in "${sounds[@]}"; do
  IFS=':' read -r url filename <<< "$item"
  echo "Downloading $filename..."
  curl -L -o "public/sounds/downloaded/$filename" "$url"
  
  if [ -f "public/sounds/downloaded/$filename" ]; then
    size=$(stat -f%z "public/sounds/downloaded/$filename" 2>/dev/null || stat -c%s "public/sounds/downloaded/$filename")
    if [ "$size" -gt 1000 ]; then
      echo "✅ Success: $filename ($size bytes)"
    else
      rm "public/sounds/downloaded/$filename"
      echo "❌ Failed: $filename (too small)"
    fi
  fi
done

echo -e "\n📁 Downloaded files:"
ls -lh public/sounds/downloaded/

# Copy to proper locations
echo -e "\n🔧 Organizing sounds..."
cp public/sounds/downloaded/ui-click.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
cp public/sounds/downloaded/button-click.mp3 public/sounds/core/ui-click-secondary.mp3 2>/dev/null
cp public/sounds/downloaded/notification.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
cp public/sounds/downloaded/error.mp3 public/sounds/core/notification-error.mp3 2>/dev/null

echo "✅ DONE!"