#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Common build error patterns and their fixes
const errorPatterns = [
  {
    pattern: /Module not found: Error: Can't resolve '(.+?)'/,
    handler: async (match) => {
      const module = match[1];
      console.log(`Installing missing module: ${module}`);
      await runCommand(`npm install ${module} --legacy-peer-deps`);
      return true;
    }
  },
  {
    pattern: /Module '"(.+?)"' has no exported member '(.+?)'/,
    handler: async (match) => {
      const [, module, member] = match;
      console.log(`Fixing missing export: ${member} from ${module}`);
      
      // Map common icon replacements
      const iconReplacements = {
        'Presentation': 'Slideshow',
        'Assessment': 'Assignment',
        'TipsAndUpdates': 'Lightbulb',
        // Add more as needed
      };
      
      if (iconReplacements[member]) {
        // Find and replace in all tsx/ts files
        await findAndReplaceInFiles(member, iconReplacements[member]);
        return true;
      }
      return false;
    }
  },
  {
    pattern: /'(.+?)' is not defined/,
    handler: async (match) => {
      const component = match[1];
      console.log(`Adding missing import for: ${component}`);
      
      // Common MUI components
      const muiComponents = ['ListItemIcon', 'ListItemButton', 'Box', 'Grid', 'Card'];
      if (muiComponents.includes(component)) {
        // This would need more logic to find the right file and add the import
        console.log(`TODO: Add ${component} to MUI imports`);
      }
      return false;
    }
  },
  {
    pattern: /Attempted import error: '(.+?)' is not exported from '(.+?)'/,
    handler: async (match) => {
      const [, exportName, modulePath] = match;
      console.log(`Fixing export: ${exportName} from ${modulePath}`);
      
      // Handle common export mismatches
      if (exportName === 'rippleContentService' && modulePath.includes('rippleContentService')) {
        await runCommand(`sed -i '' 's/export const sparkContentService/export const rippleContentService/g' src/services/rippleContentService.ts`);
        return true;
      }
      return false;
    }
  }
];

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function findAndReplaceInFiles(oldText, newText) {
  const files = await runCommand(`find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "${oldText}"`);
  const fileList = files.trim().split('\n').filter(f => f);
  
  for (const file of fileList) {
    console.log(`Updating ${file}: ${oldText} -> ${newText}`);
    await runCommand(`sed -i '' 's/${oldText}/${newText}/g' "${file}"`);
  }
}

async function runBuildAndFix() {
  console.log('Starting build...');
  
  try {
    await runCommand('CI=false npm run build');
    console.log('Build successful!');
    return true;
  } catch (error) {
    const output = error.stdout + error.stderr;
    console.log('Build failed, analyzing errors...');
    
    // Try each error pattern
    for (const { pattern, handler } of errorPatterns) {
      const match = output.match(pattern);
      if (match) {
        console.log(`Found error matching: ${pattern}`);
        const fixed = await handler(match);
        
        if (fixed) {
          // Commit the fix
          await runCommand('git add -A');
          await runCommand(`git commit -m "Auto-fix: ${match[0].substring(0, 50)}..."`);
          
          // Try building again
          return runBuildAndFix();
        }
      }
    }
    
    console.log('Could not auto-fix the error. Manual intervention needed.');
    console.log('Error output:', output);
    return false;
  }
}

// Main execution
async function main() {
  console.log('Auto-fixing build errors...');
  
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\nAttempt ${attempts}/${maxAttempts}`);
    
    const success = await runBuildAndFix();
    if (success) {
      console.log('\nBuild fixed successfully!');
      await runCommand('git push origin main');
      break;
    }
    
    if (attempts >= maxAttempts) {
      console.log('\nMax attempts reached. Manual fixes needed.');
      break;
    }
  }
}

main().catch(console.error);