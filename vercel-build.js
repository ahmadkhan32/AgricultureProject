const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Change to client directory
  process.chdir('client');
  
  // Clean previous build
  if (fs.existsSync('build')) {
    console.log('🧹 Cleaning previous build...');
    fs.rmSync('build', { recursive: true, force: true });
  }
  
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci --include=dev', { stdio: 'inherit' });
  
  // Build the app
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify build output
  if (fs.existsSync('build/index.html')) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Build output:', fs.readdirSync('build'));
    
    // Check build size
    const buildPath = path.join(process.cwd(), 'build');
    const files = fs.readdirSync(buildPath, { recursive: true });
    let totalSize = 0;
    
    files.forEach(file => {
      const filePath = path.join(buildPath, file);
      if (fs.statSync(filePath).isFile()) {
        totalSize += fs.statSync(filePath).size;
      }
    });
    
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
    console.log(`📊 Total build size: ${totalSizeMB}MB`);
    
    if (totalSize < 50 * 1024 * 1024) {
      console.log('✅ Build size is within limits');
    } else {
      console.log('⚠️  Build size is large, may cause deployment issues');
    }
  } else {
    throw new Error('Build output not found');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
