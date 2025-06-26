#!/bin/bash

echo "🎵 Downloading high-quality sound files for CRM..."

# Create directories
mkdir -p public/sounds/core
mkdir -p public/sounds/themes/boeing-747
mkdir -p public/sounds/themes/f16-viper

# Core UI Sounds from Pixabay (CC0 License)
echo -e "\n📥 Downloading Core UI Sounds..."

# UI Click sounds
wget -O public/sounds/core/ui-click-primary.mp3 "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3"
wget -O public/sounds/core/ui-click-secondary.mp3 "https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccf3232f.mp3"
wget -O public/sounds/core/ui-hover.mp3 "https://cdn.pixabay.com/audio/2022/03/15/audio_8323d19d56.mp3"
wget -O public/sounds/core/ui-toggle.mp3 "https://cdn.pixabay.com/audio/2021/08/09/audio_54ca0ffa52.mp3"

# Notifications
wget -O public/sounds/core/notification-success.mp3 "https://cdn.pixabay.com/audio/2021/08/04/audio_0625880b61.mp3"
wget -O public/sounds/core/notification-error.mp3 "https://cdn.pixabay.com/audio/2022/03/10/audio_72d9f6c7f7.mp3"

# Navigation
wget -O public/sounds/core/navigation-forward.mp3 "https://cdn.pixabay.com/audio/2023/06/22/audio_c794faa20d.mp3"
wget -O public/sounds/core/navigation-back.mp3 "https://cdn.pixabay.com/audio/2023/06/22/audio_2cc4a29173.mp3"

# Additional UI sounds
wget -O public/sounds/core/gauge-tick.mp3 "https://cdn.pixabay.com/audio/2022/10/30/audio_1cd99f1310.mp3"

# CRM-specific sounds
echo -e "\n📞 Downloading CRM-specific sounds..."
wget -O public/sounds/core/call-ringing.mp3 "https://cdn.pixabay.com/audio/2021/10/11/audio_c1cd482ec4.mp3"
wget -O public/sounds/core/call-connected.mp3 "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3"
wget -O public/sounds/core/call-ended.mp3 "https://cdn.pixabay.com/audio/2021/10/10/audio_2a93b59c35.mp3"
wget -O public/sounds/core/message-sent.mp3 "https://cdn.pixabay.com/audio/2021/10/16/audio_c0f7e14905.mp3"
wget -O public/sounds/core/message-received.mp3 "https://cdn.pixabay.com/audio/2021/08/04/audio_2c4765d4f0.mp3"
wget -O public/sounds/core/save-success.mp3 "https://cdn.pixabay.com/audio/2021/10/08/audio_73e7781c10.mp3"
wget -O public/sounds/core/task-complete.mp3 "https://cdn.pixabay.com/audio/2021/10/09/audio_26774be851.mp3"

# Boeing 747 Theme Sounds
echo -e "\n✈️ Downloading Boeing 747 Theme Sounds..."
wget -O public/sounds/themes/boeing-747/boeing-button-press.mp3 "https://cdn.pixabay.com/audio/2023/02/28/audio_fda67f3e02.mp3"
wget -O public/sounds/themes/boeing-747/boeing-autopilot-engage.mp3 "https://cdn.pixabay.com/audio/2022/12/13/audio_c4fb3c7e70.mp3"
wget -O public/sounds/themes/boeing-747/boeing-altitude-alert.mp3 "https://cdn.pixabay.com/audio/2022/10/27/audio_f5c2f4ba65.mp3"

# F-16 Viper Theme Sounds
echo -e "\n🚀 Downloading F-16 Viper Theme Sounds..."
wget -O public/sounds/themes/f16-viper/f16-radar-ping.mp3 "https://cdn.pixabay.com/audio/2023/01/31/audio_ce127bf3b8.mp3"
wget -O public/sounds/themes/f16-viper/f16-missile-lock.mp3 "https://cdn.pixabay.com/audio/2023/06/08/audio_c5e8c58962.mp3"
wget -O public/sounds/themes/f16-viper/f16-system-ready.mp3 "https://cdn.pixabay.com/audio/2022/10/06/audio_fc60cb2da9.mp3"

# Use existing sounds as fallbacks
echo -e "\n🔧 Creating fallback sounds from existing files..."

# Copy existing sounds as fallbacks
if [ -f "public/sounds/test-click.mp3" ]; then
    cp public/sounds/test-click.mp3 public/sounds/core/fallback-click.mp3
fi

# Check file sizes
echo -e "\n📊 Checking downloaded file sizes..."
ls -lah public/sounds/core/*.mp3
ls -lah public/sounds/themes/boeing-747/*.mp3
ls -lah public/sounds/themes/f16-viper/*.mp3

echo -e "\n✅ Sound download complete!"