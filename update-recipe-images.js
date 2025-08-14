import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function updateRecipeImages() {
  try {
    // Get all recipes
    const recipes = await db.recipe.findMany();
    
    // Recipe image mapping - using high quality food images
    const recipeImages = {
      "Greek Salad": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
      "Chocolate Chip Cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop", 
      "Chicken Stir Fry": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
      "Spaghetti Carbonara": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop"
    };

    for (const recipe of recipes) {
      const imageUrl = recipeImages[recipe.name];
      if (imageUrl) {
        await db.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl }
        });
        console.log(`Updated ${recipe.name} with image: ${imageUrl}`);
      }
    }
    
    console.log("All recipe images updated!");
  } catch (error) {
    console.error("Error updating images:", error);
  } finally {
    await db.$disconnect();
  }
}

updateRecipeImages();