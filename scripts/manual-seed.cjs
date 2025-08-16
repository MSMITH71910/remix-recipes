#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🔄 Resetting and seeding database...');
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await db.pantryItem.deleteMany();
    await db.pantryShelf.deleteMany();
    await db.ingredient.deleteMany();
    await db.recipe.deleteMany();
    await db.user.deleteMany();
    
    console.log('✅ Data cleared successfully');
    
    // Create a test user
    const user = await db.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }
    });
    console.log(`✅ Created user: ${user.email}`);

    // Create sample recipes with local images
    const recipe1 = await db.recipe.create({
      data: {
        name: 'Spaghetti Carbonara',
        instructions: 'Cook pasta, mix with eggs and cheese, add bacon.',
        totalTime: '20 minutes',
        imageUrl: '/spaghetti-carbonara.jpg',
        userId: user.id,
        ingredients: {
          create: [
            { name: 'Spaghetti', amount: '400g' },
            { name: 'Eggs', amount: '3 large' },
            { name: 'Parmesan cheese', amount: '100g' },
            { name: 'Bacon', amount: '200g' },
          ]
        }
      }
    });

    const recipe2 = await db.recipe.create({
      data: {
        name: 'Chicken Stir Fry',
        instructions: 'Cut chicken into strips, stir fry with vegetables.',
        totalTime: '15 minutes',
        imageUrl: '/chicken-stir-fry.jpg',
        userId: user.id,
        ingredients: {
          create: [
            { name: 'Chicken breast', amount: '500g' },
            { name: 'Mixed vegetables', amount: '300g' },
            { name: 'Soy sauce', amount: '3 tbsp' },
            { name: 'Garlic', amount: '2 cloves' },
          ]
        }
      }
    });

    const recipe3 = await db.recipe.create({
      data: {
        name: 'Chocolate Chip Cookies',
        instructions: 'Mix ingredients, form cookies, bake at 350°F for 12 minutes.',
        totalTime: '30 minutes',
        imageUrl: '/chocolate-cookies.jpg',
        userId: user.id,
        ingredients: {
          create: [
            { name: 'Flour', amount: '2 cups' },
            { name: 'Butter', amount: '1 cup' },
            { name: 'Brown sugar', amount: '1 cup' },
            { name: 'Chocolate chips', amount: '2 cups' },
            { name: 'Eggs', amount: '2 large' },
          ]
        }
      }
    });

    const recipe4 = await db.recipe.create({
      data: {
        name: 'Greek Salad',
        instructions: 'Chop vegetables, add feta cheese, dress with olive oil and lemon.',
        totalTime: '10 minutes',
        imageUrl: '/greek-salad.jpg',
        userId: user.id,
        ingredients: {
          create: [
            { name: 'Cucumber', amount: '1 large' },
            { name: 'Tomatoes', amount: '2 large' },
            { name: 'Red onion', amount: '1/2' },
            { name: 'Feta cheese', amount: '200g' },
            { name: 'Olive oil', amount: '3 tbsp' },
            { name: 'Lemon', amount: '1' },
          ]
        }
      }
    });

    // Create pantry shelves
    const fridge = await db.pantryShelf.create({
      data: {
        name: 'Refrigerator',
        userId: user.id,
      }
    });

    const pantry = await db.pantryShelf.create({
      data: {
        name: 'Pantry',
        userId: user.id,
      }
    });

    // Add some pantry items
    await db.pantryItem.createMany({
      data: [
        { name: 'Milk', userId: user.id, shelfId: fridge.id },
        { name: 'Eggs', userId: user.id, shelfId: fridge.id },
        { name: 'Rice', userId: user.id, shelfId: pantry.id },
        { name: 'Pasta', userId: user.id, shelfId: pantry.id },
      ]
    });

    console.log('🎉 Database reset and seeded successfully!');
    console.log(`✅ Created user: ${user.email}`);
    console.log(`✅ Created 4 recipes with local images`);
    console.log(`✅ Created 2 pantry shelves with items`);
  } catch (error) {
    console.error('❌ Reset and seeding failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

resetAndSeed();