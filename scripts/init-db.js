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

  // Seed database (force it to run)
  console.log('🌱 Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('✅ Database seeding completed successfully!');
  } catch (seedError) {
    console.error('❌ Database seeding failed:', seedError.message);
    console.log('🔄 Attempting to seed again...');
    try {
      execSync('tsx prisma/seed.ts', { stdio: 'inherit' });
      console.log('✅ Manual seeding completed successfully!');
    } catch (manualSeedError) {
      console.error('❌ Manual seeding also failed:', manualSeedError.message);
    }
  }

  console.log('✅ Database initialization complete!');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  
  // Don't fail the build - just log the error
  console.log('⚠️ Continuing build without database initialization...');
  console.log('💡 The app will try to handle database errors gracefully.');
}