#!/usr/bin/env node

/**
 * Script to help identify and categorize console.log statements
 * This doesn't automatically replace them but helps analyze what needs to be done
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const srcPath = path.join(__dirname, '..');
const patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const excludePatterns = [
  '**/node_modules/**',
  '**/build/**',
  '**/dist/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/logger.ts', // Don't process the logger utility itself
  '**/removeConsoleLogs.js' // Don't process this script
];

// Categories of console statements
const categories = {
  debug: [],
  info: [],
  critical: [],
  temporary: []
};

// Analyze a file
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const results = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for console.log
    if (line.includes('console.log')) {
      // Categorize based on content
      if (line.toLowerCase().includes('debug') || 
          line.toLowerCase().includes('raw') ||
          line.toLowerCase().includes('===')) {
        categories.debug.push({ file: filePath, line: lineNum, content: line.trim() });
      } else if (line.toLowerCase().includes('initialized') ||
                 line.toLowerCase().includes('completed') ||
                 line.toLowerCase().includes('success')) {
        categories.info.push({ file: filePath, line: lineNum, content: line.trim() });
      } else if (line.toLowerCase().includes('error') ||
                 line.toLowerCase().includes('failed')) {
        categories.critical.push({ file: filePath, line: lineNum, content: line.trim() });
      } else {
        categories.temporary.push({ file: filePath, line: lineNum, content: line.trim() });
      }
    }
  });

  return results;
}

// Main execution
console.log('Analyzing console.log statements in the codebase...\n');

// Find all matching files
patterns.forEach(pattern => {
  const files = glob.sync(path.join(srcPath, pattern), {
    ignore: excludePatterns
  });

  files.forEach(file => {
    analyzeFile(file);
  });
});

// Report results
console.log('=== Console.log Analysis Report ===\n');

console.log(`Debug logs (should use logger.debug): ${categories.debug.length}`);
categories.debug.slice(0, 5).forEach(item => {
  console.log(`  ${path.relative(srcPath, item.file)}:${item.line}`);
  console.log(`    ${item.content.substring(0, 80)}...`);
});
if (categories.debug.length > 5) {
  console.log(`  ... and ${categories.debug.length - 5} more\n`);
}

console.log(`\nInfo logs (should use logger.info): ${categories.info.length}`);
categories.info.slice(0, 5).forEach(item => {
  console.log(`  ${path.relative(srcPath, item.file)}:${item.line}`);
  console.log(`    ${item.content.substring(0, 80)}...`);
});
if (categories.info.length > 5) {
  console.log(`  ... and ${categories.info.length - 5} more\n`);
}

console.log(`\nCritical logs (might need special handling): ${categories.critical.length}`);
categories.critical.slice(0, 5).forEach(item => {
  console.log(`  ${path.relative(srcPath, item.file)}:${item.line}`);
  console.log(`    ${item.content.substring(0, 80)}...`);
});

console.log(`\nTemporary/other logs (should be removed or converted): ${categories.temporary.length}`);
categories.temporary.slice(0, 5).forEach(item => {
  console.log(`  ${path.relative(srcPath, item.file)}:${item.line}`);
  console.log(`    ${item.content.substring(0, 80)}...`);
});

const total = categories.debug.length + categories.info.length + 
              categories.critical.length + categories.temporary.length;
console.log(`\nTotal console.log statements found: ${total}`);

// Save detailed report
const reportPath = path.join(__dirname, 'console-log-report.json');
fs.writeFileSync(reportPath, JSON.stringify(categories, null, 2));
console.log(`\nDetailed report saved to: ${reportPath}`);