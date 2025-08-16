#!/usr/bin/env node

const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('🔧 Setting up database manually...');
  
  try {
    // Step 1: Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated!');
    
    // Step 2: Create database schema
    console.log('🗃️ Creating database schema...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations deployed!');
    } catch (migrateError) {
      console.log('⚠️ Migrate failed, trying db push...');
      execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      console.log('✅ Schema pushed!');
    }
    
    // Step 3: Verify tables exist
    console.log('🔍 Verifying database setup...');
    const { PrismaClient } = require('@prisma/client');
    const db = new PrismaClient();
    
    try {
      // Simple test query
      const userCount = await db.user.count();
      console.log(`✅ Database is working! Found ${userCount} users.`);
      
      // Step 4: Seed if empty
      if (userCount === 0) {
        console.log('🌱 Database is empty, seeding...');
        execSync('node scripts/manual-seed.cjs', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully!');
      } else {
        console.log('📊 Database already has data, skipping seed.');
      }
    } catch (dbTestError) {
      console.error('❌ Database test failed:', dbTestError.message);
      throw dbTestError;
    } finally {
      await db.$disconnect();
    }
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('💡 Try running individual commands:');
    console.error('   1. npx prisma generate');
    console.error('   2. npx prisma migrate deploy');
    console.error('   3. node scripts/manual-seed.cjs');
    process.exit(1);
  }
}

setupDatabase();