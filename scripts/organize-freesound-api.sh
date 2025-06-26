#!/bin/bash
# Organize Freesound downloads into CRM directories

echo "🎵 Organizing Freesound downloads..."

# Core UI sounds
cp -f public/sounds/freesound/uiClicks/ui-click-soft.mp3 public/sounds/core/ui-click-primary.mp3 2>/dev/null
cp -f public/sounds/freesound/uiClicks/ui-click-sharp.mp3 public/sounds/core/ui-click-secondary.mp3 2>/dev/null
cp -f public/sounds/freesound/hover/ui-hover-soft.mp3 public/sounds/core/ui-hover.mp3 2>/dev/null
cp -f public/sounds/freesound/toggle/ui-toggle-on.mp3 public/sounds/core/ui-toggle.mp3 2>/dev/null

# Notifications
cp -f public/sounds/freesound/notifications/notification-chime.mp3 public/sounds/core/notification-success.mp3 2>/dev/null
cp -f public/sounds/freesound/feedback/error-buzz.mp3 public/sounds/core/notification-error.mp3 2>/dev/null

# Aviation theme
mkdir -p public/sounds/themes/boeing-747
cp -f public/sounds/freesound/aviation/cockpit-button.mp3 public/sounds/themes/boeing-747/boeing-button-press.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/autopilot-engage.mp3 public/sounds/themes/boeing-747/boeing-autopilot-engage.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/altitude-warning.mp3 public/sounds/themes/boeing-747/boeing-altitude-alert.mp3 2>/dev/null

mkdir -p public/sounds/themes/f16-viper
cp -f public/sounds/freesound/aviation/radar-ping.mp3 public/sounds/themes/f16-viper/f16-radar-ping.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/missile-lock.mp3 public/sounds/themes/f16-viper/f16-missile-lock.mp3 2>/dev/null
cp -f public/sounds/freesound/aviation/radar-sweep.mp3 public/sounds/themes/f16-viper/f16-system-ready.mp3 2>/dev/null

echo "✅ Sound organization complete!"
echo ""
echo "📁 Check these directories:"
echo "  - public/sounds/core/"
echo "  - public/sounds/themes/boeing-747/"
echo "  - public/sounds/themes/f16-viper/"
