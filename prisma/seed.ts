import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function seed() {
  // Create sample users with realistic names
  const user1 = await db.user.create({
    data: {
      email: 'chef.maria@example.com',
      firstName: 'Maria',
      lastName: 'Rodriguez',
    }
  })
  
  const user2 = await db.user.create({
    data: {
      email: 'john.cook@example.com',
      firstName: 'John',
      lastName: 'Smith',
    }
  })
  
  const user3 = await db.user.create({
    data: {
      email: 'sarah.baker@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
    }
  })

  // Create some sample recipes with different authors
  const recipe1 = await db.recipe.create({
    data: {
      name: 'Authentic Spaghetti Carbonara',
      instructions: 'Bring a pot of salted water to boil. Cook spaghetti until al dente. In a bowl, whisk eggs with grated Parmesan. Cook pancetta until crispy. Drain pasta, reserving pasta water. Toss hot pasta with pancetta, then quickly stir in egg mixture with a splash of pasta water. Season with black pepper.',
      totalTime: '20 minutes',
      imageUrl: '/recipe-placeholder.svg',
      userId: user1.id, // Maria Rodriguez (Italian cuisine expert)
      ingredients: {
        create: [
          { name: 'Spaghetti', amount: '400g' },
          { name: 'Large eggs', amount: '3' },
          { name: 'Parmigiano-Reggiano cheese', amount: '100g grated' },
          { name: 'Pancetta', amount: '200g diced' },
          { name: 'Black pepper', amount: 'freshly ground' },
        ]
      }
    }
  })

  const recipe2 = await db.recipe.create({
    data: {
      name: 'Asian Chicken Stir Fry',
      instructions: 'Cut chicken into thin strips. Heat wok or large skillet over high heat. Add oil, then chicken. Stir-fry 3-4 minutes. Add vegetables and stir-fry 2-3 minutes. Mix in sauce and cook 1 minute more. Serve over rice.',
      totalTime: '15 minutes',
      imageUrl: '/recipe-placeholder.svg',
      userId: user2.id, // John Smith
      ingredients: {
        create: [
          { name: 'Chicken breast', amount: '500g sliced' },
          { name: 'Mixed vegetables', amount: '300g' },
          { name: 'Soy sauce', amount: '3 tbsp' },
          { name: 'Fresh garlic', amount: '2 cloves minced' },
          { name: 'Vegetable oil', amount: '2 tbsp' },
        ]
      }
    }
  })
  
  const recipe3 = await db.recipe.create({
    data: {
      name: 'Classic Chocolate Chip Cookies',
      instructions: 'Preheat oven to 375°F. Cream butter and sugars. Beat in eggs and vanilla. Combine flour, baking soda, and salt. Gradually mix into creamed mixture. Stir in chocolate chips. Drop rounded tablespoons onto ungreased cookie sheets. Bake 9-11 minutes until golden brown.',
      totalTime: '25 minutes',
      imageUrl: '/recipe-placeholder.svg',
      userId: user3.id, // Sarah Johnson (baker)
      ingredients: {
        create: [
          { name: 'All-purpose flour', amount: '2¼ cups' },
          { name: 'Butter', amount: '1 cup softened' },
          { name: 'Brown sugar', amount: '¾ cup packed' },
          { name: 'White sugar', amount: '¼ cup' },
          { name: 'Large eggs', amount: '2' },
          { name: 'Vanilla extract', amount: '2 tsp' },
          { name: 'Chocolate chips', amount: '2 cups' },
        ]
      }
    }
  })

  const recipe4 = await db.recipe.create({
    data: {
      name: 'Mediterranean Greek Salad',
      instructions: 'Cut cucumber and tomatoes into chunks. Slice red onion thinly. Combine in a bowl with olives. Crumble feta on top. Drizzle with olive oil and fresh lemon juice. Season with oregano, salt, and pepper.',
      totalTime: '10 minutes',
      imageUrl: '/recipe-placeholder.svg',
      userId: user1.id, // Maria Rodriguez
      ingredients: {
        create: [
          { name: 'English cucumber', amount: '1 large' },
          { name: 'Ripe tomatoes', amount: '2 large' },
          { name: 'Red onion', amount: '1/2 medium' },
          { name: 'Feta cheese', amount: '200g crumbled' },
          { name: 'Extra virgin olive oil', amount: '3 tbsp' },
          { name: 'Fresh lemon', amount: '1 juiced' },
          { name: 'Kalamata olives', amount: '1/2 cup' },
        ]
      }
    }
  })

  // Create pantry shelves for Maria
  const fridge = await db.pantryShelf.create({
    data: {
      name: 'Refrigerator',
      userId: user1.id,
    }
  })

  const pantry = await db.pantryShelf.create({
    data: {
      name: 'Pantry',
      userId: user1.id,
    }
  })

  // Add some pantry items for Maria
  await db.pantryItem.createMany({
    data: [
      { name: 'Milk', userId: user1.id, shelfId: fridge.id },
      { name: 'Eggs', userId: user1.id, shelfId: fridge.id },
      { name: 'Rice', userId: user1.id, shelfId: pantry.id },
      { name: 'Pasta', userId: user1.id, shelfId: pantry.id },
    ]
  })

  console.log('Database seeded successfully!')
  console.log(`Created users: Maria Rodriguez, John Smith, Sarah Johnson`)
  console.log(`Created 4 recipes`)
  console.log(`Created pantry shelves with items for Maria`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })