#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function simpleSeed() {
  try {
    console.log('🌱 Creating test user...');
    
    // Delete existing test user if exists
    await db.user.deleteMany({ where: { email: 'test@example.com' } });
    
    // Create test user
    const user = await db.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }
    });
    console.log(`✅ Created user: ${user.email}`);
    
    // Create a simple recipe
    const recipe = await db.recipe.create({
      data: {
        name: 'Test Recipe',
        instructions: 'This is a test recipe.',
        totalTime: '10 minutes',
        imageUrl: '/recipe-placeholder.svg',
        userId: user.id,
        ingredients: {
          create: [
            { name: 'Test Ingredient', amount: '1 cup' }
          ]
        }
      }
    });
    console.log(`✅ Created recipe: ${recipe.name}`);
    
    console.log('🎉 Simple seeding completed successfully!');
  } catch (error) {
    console.error('❌ Simple seeding failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

simpleSeed();