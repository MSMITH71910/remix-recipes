#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function fullSeed() {
  try {
    console.log('🌱 Seeding full recipe database...');
    
    // Delete existing data
    await db.pantryItem.deleteMany();
    await db.pantryShelf.deleteMany();
    await db.ingredient.deleteMany();
    await db.recipe.deleteMany();
    await db.user.deleteMany();
    
    // Create a test user
    const user = await db.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }
    });
    console.log(`✅ Created user: ${user.email}`);

    // Create sample recipes with better images from Unsplash
    const recipe1 = await db.recipe.create({
      data: {
        name: 'Spaghetti Carbonara',
        instructions: 'Cook pasta, mix with eggs and cheese, add bacon.',
        totalTime: '20 minutes',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
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
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
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
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
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
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
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

    console.log('✅ Database seeded successfully!');
    console.log(`✅ Created user: ${user.email}`);
    console.log(`✅ Created 4 recipes with images`);
    console.log(`✅ Created 2 pantry shelves with items`);
    console.log('🎉 Full seeding completed successfully!');
  } catch (error) {
    console.error('❌ Full seeding failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

fullSeed();