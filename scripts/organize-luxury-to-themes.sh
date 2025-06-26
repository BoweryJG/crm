#!/bin/bash

echo "🎨 ORGANIZING LUXURY SOUNDS INTO THEMES"
echo "======================================="

# Boeing 747-8 Cockpit
echo -e "\n✈️ Boeing 747-8 Cockpit Theme..."
cp public/sounds/luxury/ui/door-thud.mp3 public/sounds/themes/boeing-747/boeing-heavy-switch.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/deep-resonance.mp3 public/sounds/themes/boeing-747/boeing-engine-startup.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/tension-build.mp3 public/sounds/themes/boeing-747/boeing-critical-alert.mp3 2>/dev/null
cp public/sounds/luxury/feedback/hall-reverb.mp3 public/sounds/themes/boeing-747/boeing-cockpit-echo.mp3 2>/dev/null
cp public/sounds/luxury/ambient/bass-pulse.mp3 public/sounds/themes/boeing-747/boeing-engine-idle.mp3 2>/dev/null
echo "✅ Added 5 sounds"

# Corporate Professional
echo -e "\n💼 Corporate Professional Theme..."
mkdir -p public/sounds/themes/corporate-professional
cp public/sounds/luxury/ui/leather-creak.mp3 public/sounds/themes/corporate-professional/corp-briefcase-open.mp3 2>/dev/null
cp public/sounds/luxury/ui/crystal-ting.mp3 public/sounds/themes/corporate-professional/corp-achievement.mp3 2>/dev/null
cp public/sounds/luxury/feedback/piano-chord.mp3 public/sounds/themes/corporate-professional/corp-notification.mp3 2>/dev/null
cp public/sounds/luxury/natural/water-drop.mp3 public/sounds/themes/corporate-professional/corp-subtle-click.mp3 2>/dev/null
cp public/sounds/luxury/ui/glass-clink.mp3 public/sounds/themes/corporate-professional/corp-deal-closed.mp3 2>/dev/null
cp public/sounds/luxury/natural/fireplace.mp3 public/sounds/themes/corporate-professional/corp-ambient.mp3 2>/dev/null
echo "✅ Added 6 sounds"

# F-16 Viper
echo -e "\n🚀 F-16 Viper Fighter Jet Theme..."
cp public/sounds/luxury/cinematic/cinematic-impact.mp3 public/sounds/themes/f16-viper/f16-target-lock.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/orchestra-hit.mp3 public/sounds/themes/f16-viper/f16-threat-detected.mp3 2>/dev/null
cp public/sounds/luxury/ambient/cinematic-whoosh.mp3 public/sounds/themes/f16-viper/f16-jet-maneuver.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/tension-build.mp3 public/sounds/themes/f16-viper/f16-missile-warning.mp3 2>/dev/null
cp public/sounds/luxury/feedback/hall-reverb.mp3 public/sounds/themes/f16-viper/f16-cockpit-comm.mp3 2>/dev/null
echo "✅ Added 5 sounds"

# Formula 1 Racing
echo -e "\n🏎️ Formula 1 Racing Theme..."
mkdir -p public/sounds/themes/formula1-racing
cp public/sounds/luxury/cinematic/film-click.mp3 public/sounds/themes/formula1-racing/f1-paddle-shift.mp3 2>/dev/null
cp public/sounds/luxury/ui/champagne-pop.mp3 public/sounds/themes/formula1-racing/f1-victory.mp3 2>/dev/null
cp public/sounds/luxury/ambient/orchestral-swell.mp3 public/sounds/themes/formula1-racing/f1-race-start.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/cinematic-impact.mp3 public/sounds/themes/formula1-racing/f1-drs-activation.mp3 2>/dev/null
cp public/sounds/luxury/feedback/violin-pizz.mp3 public/sounds/themes/formula1-racing/f1-telemetry.mp3 2>/dev/null
echo "✅ Added 5 sounds"

# Hermès Luxury
echo -e "\n👜 Hermès Luxury Experience Theme..."
mkdir -p public/sounds/themes/luxury-hermes
cp public/sounds/luxury/ui/crystal-ting.mp3 public/sounds/themes/luxury-hermes/hermes-jewelry-click.mp3 2>/dev/null
cp public/sounds/luxury/ui/champagne-pop.mp3 public/sounds/themes/luxury-hermes/hermes-success.mp3 2>/dev/null
cp public/sounds/luxury/ui/glass-clink.mp3 public/sounds/themes/luxury-hermes/hermes-achievement.mp3 2>/dev/null
cp public/sounds/luxury/natural/wind-chimes.mp3 public/sounds/themes/luxury-hermes/hermes-hover.mp3 2>/dev/null
cp public/sounds/luxury/feedback/harp-success.mp3 public/sounds/themes/luxury-hermes/hermes-purchase.mp3 2>/dev/null
cp public/sounds/luxury/ui/leather-creak.mp3 public/sounds/themes/luxury-hermes/hermes-navigation.mp3 2>/dev/null
cp public/sounds/luxury/natural/ocean-waves.mp3 public/sounds/themes/luxury-hermes/hermes-ambient.mp3 2>/dev/null
echo "✅ Added 7 sounds"

# Medical Surgical
echo -e "\n🏥 Medical Surgical Theme..."
mkdir -p public/sounds/themes/medical-surgical
cp public/sounds/luxury/natural/water-drop.mp3 public/sounds/themes/medical-surgical/med-iv-drip.mp3 2>/dev/null
cp public/sounds/luxury/ui/crystal-ting.mp3 public/sounds/themes/medical-surgical/med-procedure-complete.mp3 2>/dev/null
cp public/sounds/luxury/feedback/piano-chord.mp3 public/sounds/themes/medical-surgical/med-patient-update.mp3 2>/dev/null
cp public/sounds/luxury/natural/church-bell.mp3 public/sounds/themes/medical-surgical/med-emergency-soft.mp3 2>/dev/null
cp public/sounds/luxury/feedback/violin-pizz.mp3 public/sounds/themes/medical-surgical/med-instrument-select.mp3 2>/dev/null
echo "✅ Added 5 sounds"

# Rolex Watchmaking
echo -e "\n⌚ Rolex Watchmaking Excellence Theme..."
mkdir -p public/sounds/themes/rolex-watchmaking
cp public/sounds/luxury/ui/watch-tick.mp3 public/sounds/themes/rolex-watchmaking/rolex-tick.mp3 2>/dev/null
cp public/sounds/luxury/ui/crystal-ting.mp3 public/sounds/themes/rolex-watchmaking/rolex-certification.mp3 2>/dev/null
cp public/sounds/luxury/ui/glass-clink.mp3 public/sounds/themes/rolex-watchmaking/rolex-bezel-click.mp3 2>/dev/null
cp public/sounds/luxury/feedback/piano-chord.mp3 public/sounds/themes/rolex-watchmaking/rolex-complication.mp3 2>/dev/null
cp public/sounds/luxury/natural/wind-chimes.mp3 public/sounds/themes/rolex-watchmaking/rolex-perpetual.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/film-click.mp3 public/sounds/themes/rolex-watchmaking/rolex-crown-wind.mp3 2>/dev/null
echo "✅ Added 6 sounds"

# Space Station Interface
echo -e "\n🚀 Space Station Interface Theme..."
mkdir -p public/sounds/themes/space-scifi
cp public/sounds/luxury/ambient/cinematic-whoosh.mp3 public/sounds/themes/space-scifi/space-warp-drive.mp3 2>/dev/null
cp public/sounds/luxury/ambient/orchestral-swell.mp3 public/sounds/themes/space-scifi/space-system-startup.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/deep-resonance.mp3 public/sounds/themes/space-scifi/space-airlock.mp3 2>/dev/null
cp public/sounds/luxury/cinematic/tension-build.mp3 public/sounds/themes/space-scifi/space-critical-alert.mp3 2>/dev/null
cp public/sounds/luxury/feedback/hall-reverb.mp3 public/sounds/themes/space-scifi/space-station-echo.mp3 2>/dev/null
cp public/sounds/luxury/ui/crystal-ting.mp3 public/sounds/themes/space-scifi/space-hologram-touch.mp3 2>/dev/null
echo "✅ Added 6 sounds"

# Show summary
echo -e "\n📊 THEME SOUND DISTRIBUTION:"
echo "================================"
for theme in public/sounds/themes/*/; do
  if [ -d "$theme" ]; then
    count=$(ls -1 "$theme"*.mp3 2>/dev/null | wc -l)
    theme_name=$(basename "$theme")
    printf "%-25s: %2d sounds\n" "$theme_name" "$count"
  fi
done

echo -e "\n✅ All luxury sounds organized into appropriate themes!"