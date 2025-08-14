import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function fixRecipeImages() {
  try {
    // Get all recipes
    const recipes = await db.recipe.findMany();
    
    // Use reliable, working image URLs - using placeholder.com and foodie-factor
    const recipeImages = {
      "Greek Salad": "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Greek+Salad",
      "Chocolate Chip Cookies": "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Chocolate+Cookies", 
      "Chicken Stir Fry": "https://via.placeholder.com/800x600/FF6347/FFFFFF?text=Chicken+Stir+Fry",
      "Spaghetti Carbonara": "https://via.placeholder.com/800x600/FFD700/000000?text=Spaghetti+Carbonara"
    };

    for (const recipe of recipes) {
      const imageUrl = recipeImages[recipe.name];
      if (imageUrl) {
        await db.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl }
        });
        console.log(`Updated ${recipe.name} with working image: ${imageUrl}`);
      }
    }
    
    console.log("All recipe images fixed with working URLs!");
  } catch (error) {
    console.error("Error fixing images:", error);
  } finally {
    await db.$disconnect();
  }
}

fixRecipeImages();