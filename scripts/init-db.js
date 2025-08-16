#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Initializing database for production...');

try {
  // Ensure database directory exists
  const dbDir = path.dirname(process.env.DATABASE_URL?.replace('file:', '') || './database.sqlite');
  if (!fs.existsSync(dbDir) && dbDir !== '.') {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Created database directory: ${dbDir}`);
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run database migrations
  console.log('🗃️ Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Seed database with simple seed script
  console.log('🌱 Seeding database...');
  try {
    execSync('node scripts/simple-seed.js', { stdio: 'inherit' });
    console.log('✅ Database seeding completed successfully!');
  } catch (seedError) {
    console.error('❌ Simple seeding failed:', seedError.message);
    console.log('🔄 Trying original seed...');
    try {
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Fallback seeding completed successfully!');
    } catch (fallbackError) {
      console.warn('⚠️ All seeding failed - app will have empty data');
    }
  }

  console.log('✅ Database initialization complete!');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  
  // Don't fail the build - just log the error
  console.log('⚠️ Continuing build without database initialization...');
  console.log('💡 The app will try to handle database errors gracefully.');
}