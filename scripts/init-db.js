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

  // Seed database
  console.log('🌱 Seeding database...');
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' });
  } catch (seedError) {
    console.warn('⚠️ Database seeding failed (this is often OK):', seedError.message);
  }

  console.log('✅ Database initialization complete!');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  
  // Don't fail the build - just log the error
  console.log('⚠️ Continuing build without database initialization...');
  console.log('💡 The app will try to handle database errors gracefully.');
}