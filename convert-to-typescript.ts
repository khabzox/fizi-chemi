#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to exclude from conversion
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'out',
  '.git',
  'dist',
  'build'
];

// Files to exclude from conversion
const EXCLUDED_FILES = [
  'next.config.js',
  'next.config.mjs',
  'tailwind.config.js',
  'postcss.config.js',
  'prettier.config.js',
  '.eslintrc.js'
];

let convertedCount = 0;
let skippedCount = 0;
let foundFiles = [];

function scanForFiles(dirPath) {
  if (shouldExcludeDirectory(dirPath)) {
    return;
  }

  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanForFiles(fullPath);
      } else if (stats.isFile()) {
        const ext = path.extname(fullPath);
        if (ext === '.js' || ext === '.jsx') {
          foundFiles.push(fullPath);
          const willConvert = !shouldExcludeFile(fullPath);
          console.log(`${willConvert ? '✅' : '⏭️'} Found: ${fullPath} ${willConvert ? '(will convert)' : '(excluded)'}`);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
  }
}

function shouldExcludeDirectory(dirPath) {
  const dirName = path.basename(dirPath);
  return EXCLUDED_DIRS.includes(dirName);
}

function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  return EXCLUDED_FILES.includes(fileName);
}

function getNewExtension(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.jsx') return '.tsx';
  if (ext === '.js') return '.ts';
  return null;
}

function renameFile(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Converted: ${oldPath} → ${newPath}`);
    convertedCount++;
  } catch (error) {
    console.error(`❌ Error converting ${oldPath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  if (shouldExcludeDirectory(dirPath)) {
    console.log(`⏭️  Skipping directory: ${dirPath}`);
    return;
  }

  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        processDirectory(fullPath);
      } else if (stats.isFile()) {
        const ext = path.extname(fullPath);
        
        // Check if it's a file we want to convert
        if ((ext === '.js' || ext === '.jsx') && !shouldExcludeFile(fullPath)) {
          const newExt = getNewExtension(fullPath);
          if (newExt) {
            const newPath = fullPath.replace(new RegExp(`\\${ext}$`), newExt);
            renameFile(fullPath, newPath);
          }
        } else if (ext === '.js' || ext === '.jsx') {
          console.log(`⏭️  Skipping excluded file: ${fullPath}`);
          skippedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting JavaScript to TypeScript file conversion...\n');
  
  const startTime = Date.now();
  const projectRoot = process.cwd();
  
  console.log(`📁 Project root: ${projectRoot}`);
  console.log(`📋 Excluded directories: ${EXCLUDED_DIRS.join(', ')}`);
  console.log(`📋 Excluded files: ${EXCLUDED_FILES.join(', ')}\n`);
  
  // First, let's scan what files we have
  console.log('🔍 Scanning for JavaScript files...');
  scanForFiles(projectRoot);
  
  console.log(`\n🔍 Total .js/.jsx files found: ${foundFiles.length}`);
  
  if (foundFiles.length === 0) {
    console.log('🤔 No .js or .jsx files found to convert.');
    console.log('This could mean:');
    console.log('   • Your project is already using TypeScript');
    console.log('   • All files are in excluded directories');
    console.log('   • Your source files are in a different location');
    return;
  }
  
  console.log('\n📝 Starting conversion...');
  processDirectory(projectRoot);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n📊 Conversion Summary:');
  console.log(`✅ Files converted: ${convertedCount}`);
  console.log(`⏭️  Files skipped: ${skippedCount}`);
  console.log(`⏱️  Time taken: ${duration.toFixed(2)}s`);
  
  if (convertedCount > 0) {
    console.log('\n🎉 Conversion completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Run `pnpm run type-check` to check for TypeScript errors');
    console.log('   2. Fix any type errors that appear');
    console.log('   3. Add type annotations gradually');
  } else {
    console.log('\n🤔 No files were converted. This might mean:');
    console.log('   • All files are already TypeScript (.ts/.tsx)');
    console.log('   • All .js/.jsx files are in excluded directories');
    console.log('   • All .js/.jsx files are in the excluded files list');
  }
}

// Run the script
main();