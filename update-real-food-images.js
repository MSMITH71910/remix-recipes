import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function updateRealFoodImages() {
  try {
    // Get all recipes
    const recipes = await db.recipe.findMany();
    
    // Use local food images we just created
    const recipeImages = {
      "Greek Salad": "/greek-salad.jpg",
      "Chocolate Chip Cookies": "/chocolate-cookies.jpg", 
      "Chicken Stir Fry": "/chicken-stir-fry.jpg",
      "Spaghetti Carbonara": "/spaghetti-carbonara.jpg"
    };

    for (const recipe of recipes) {
      const imageUrl = recipeImages[recipe.name];
      if (imageUrl) {
        await db.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl }
        });
        console.log(`Updated ${recipe.name} with actual food image: ${imageUrl}`);
      }
    }
    
    console.log("All recipes updated with real food images!");
  } catch (error) {
    console.error("Error updating images:", error);
  } finally {
    await db.$disconnect();
  }
}

updateRealFoodImages();