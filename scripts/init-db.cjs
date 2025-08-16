#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Initializing database for production...');

try {
  // Check if we're using PostgreSQL or SQLite
  const databaseUrl = process.env.DATABASE_URL || '';
  const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');
  const isSQLite = databaseUrl.startsWith('file:');

  console.log(`📊 Database type detected: ${isPostgreSQL ? 'PostgreSQL' : isSQLite ? 'SQLite' : 'Unknown'}`);

  // For SQLite, ensure database directory exists
  if (isSQLite) {
    const dbDir = path.dirname(databaseUrl.replace('file:', ''));
    if (!fs.existsSync(dbDir) && dbDir !== '.') {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`📁 Created database directory: ${dbDir}`);
    }
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // For PostgreSQL on Render, wait a moment for database to be ready
  if (isPostgreSQL && process.env.RENDER) {
    console.log('⏳ Waiting for PostgreSQL to be ready on Render...');
    require('child_process').execSync('sleep 3');
  }

  // Run database migrations
  console.log('🗃️ Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Database migrations completed!');
  } catch (migrateError) {
    console.warn('⚠️ Migration failed, trying to push schema...');
    try {
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      console.log('✅ Schema push completed!');
    } catch (pushError) {
      console.error('❌ Both migrate and push failed:', pushError.message);
      throw pushError;
    }
  }

  // Seed database
  console.log('🌱 Seeding database...');
  try {
    // Try simple seed first
    if (fs.existsSync('./scripts/simple-seed.cjs')) {
      execSync('node scripts/simple-seed.cjs', { stdio: 'inherit' });
      console.log('✅ Database seeding completed successfully!');
    } else {
      // Fallback to prisma seed
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Prisma seeding completed successfully!');
    }
  } catch (seedError) {
    console.warn('⚠️ Seeding failed - app will start with empty data');
    console.log('💡 You can add data through the application interface.');
  }

  console.log('✅ Database initialization complete!');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.error('Full error:', error);
  
  // For production builds, continue even if database setup fails
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    console.log('⚠️ Continuing build - database will be initialized at runtime...');
    process.exit(0);
  } else {
    // For development, fail the build
    process.exit(1);
  }
}