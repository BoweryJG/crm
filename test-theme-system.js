// Quick test of the theme system
const { themeLibrary, themeCategories, getThemesByCategory, getPremiumThemes } = require('./src/themes/themeLibrary.ts');

console.log('🎨 Theme System Test\n');

// Test theme library
console.log(`📚 Total themes in library: ${themeLibrary.length}`);

// Test categories
console.log('\n📂 Categories:');
Object.entries(themeCategories).forEach(([key, name]) => {
  const themes = getThemesByCategory(key);
  console.log(`  ${name}: ${themes.length} themes`);
});

// Test premium themes
const premiumThemes = getPremiumThemes();
console.log(`\n💎 Premium themes: ${premiumThemes.length}`);

// Sample themes by category
console.log('\n🎯 Sample themes by category:');
Object.keys(themeCategories).forEach(category => {
  const themes = getThemesByCategory(category);
  if (themes.length > 0) {
    console.log(`\n${themeCategories[category]}:`);
    themes.slice(0, 3).forEach(theme => {
      console.log(`  - ${theme.name}: ${theme.description}`);
    });
  }
});

console.log('\n✅ Theme system test completed successfully!');