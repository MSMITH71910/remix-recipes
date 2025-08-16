const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function addPantryItems() {
  console.log('🥬 Adding test pantry items...');
  
  // Get or create user
  let user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) {
    user = await db.user.create({
      data: { email: "test@example.com", firstName: "Test", lastName: "User" }
    });
  }

  // Create pantry shelf if doesn't exist
  let shelf = await db.pantryShelf.findFirst({ where: { userId: user.id, name: "Fresh Produce" } });
  if (!shelf) {
    shelf = await db.pantryShelf.create({
      data: { name: "Fresh Produce", userId: user.id }
    });
  }

  // Add pantry items that match recipe ingredients
  const items = [
    { name: "Bell peppers", quantity: "10" },
    { name: "Chicken breast", quantity: "5" },
    { name: "Spaghetti pasta", quantity: "3" },
    { name: "Eggs", quantity: "12" },
    { name: "Parmesan cheese", quantity: "2" },
    { name: "Bacon", quantity: "4" },
    { name: "Romaine lettuce", quantity: "6" }
  ];

  for (const item of items) {
    // Check if item already exists
    const existing = await db.pantryItem.findFirst({
      where: { userId: user.id, name: item.name }
    });

    if (!existing) {
      await db.pantryItem.create({
        data: {
          name: item.name,
          quantity: item.quantity,
          userId: user.id,
          shelfId: shelf.id
        }
      });
      console.log(`✅ Added: ${item.name} (${item.quantity})`);
    } else {
      console.log(`⚠️  Already exists: ${item.name}`);
    }
  }

  console.log('🎉 Pantry items added!');
  await db.$disconnect();
}

addPantryItems().catch(console.error);
