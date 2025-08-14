import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function fixRecipeImagesFinal() {
  try {
    // Get all recipes
    const recipes = await db.recipe.findMany();
    
    // Use data URI images that will definitely work
    const recipeImages = {
      "Greek Salad": "data:image/svg+xml;base64," + Buffer.from(`
        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#4CAF50"/>
          <circle cx="400" cy="200" r="80" fill="#FF6B6B"/>
          <circle cx="320" cy="280" r="60" fill="#FFE066"/>
          <circle cx="480" cy="280" r="60" fill="#FFFFFF"/>
          <circle cx="400" cy="360" r="50" fill="#8E44AD"/>
          <text x="400" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="48" font-weight="bold">Greek Salad</text>
        </svg>
      `).toString('base64'),
      
      "Chocolate Chip Cookies": "data:image/svg+xml;base64," + Buffer.from(`
        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#D2691E"/>
          <circle cx="300" cy="200" r="70" fill="#F4A460"/>
          <circle cx="500" cy="200" r="70" fill="#F4A460"/>
          <circle cx="400" cy="350" r="70" fill="#F4A460"/>
          <circle cx="280" cy="180" r="8" fill="#654321"/>
          <circle cx="320" cy="210" r="8" fill="#654321"/>
          <circle cx="480" cy="180" r="8" fill="#654321"/>
          <circle cx="520" cy="210" r="8" fill="#654321"/>
          <circle cx="380" cy="330" r="8" fill="#654321"/>
          <circle cx="420" cy="370" r="8" fill="#654321"/>
          <text x="400" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="36" font-weight="bold">Chocolate Cookies</text>
        </svg>
      `).toString('base64'),
      
      "Chicken Stir Fry": "data:image/svg+xml;base64," + Buffer.from(`
        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#FF6347"/>
          <rect x="200" y="150" width="120" height="80" fill="#FFD700" rx="10"/>
          <rect x="350" y="180" width="100" height="60" fill="#32CD32" rx="8"/>
          <rect x="480" y="160" width="110" height="70" fill="#FF69B4" rx="8"/>
          <rect x="250" y="280" width="130" height="90" fill="#FFA500" rx="10"/>
          <rect x="420" y="300" width="120" height="80" fill="#9ACD32" rx="8"/>
          <text x="400" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="42" font-weight="bold">Stir Fry</text>
        </svg>
      `).toString('base64'),
      
      "Spaghetti Carbonara": "data:image/svg+xml;base64," + Buffer.from(`
        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#FFD700"/>
          <path d="M200 200 Q400 150 600 200 Q400 250 200 200" fill="#FFEB3B"/>
          <path d="M220 250 Q400 200 580 250 Q400 300 220 250" fill="#FFF176"/>
          <path d="M240 300 Q400 250 560 300 Q400 350 240 300" fill="#FFEE58"/>
          <circle cx="350" cy="220" r="15" fill="#F44336"/>
          <circle cx="450" cy="270" r="15" fill="#F44336"/>
          <circle cx="380" cy="320" r="15" fill="#F44336"/>
          <text x="400" y="480" text-anchor="middle" fill="#333" font-family="Arial" font-size="36" font-weight="bold">Spaghetti Carbonara</text>
        </svg>
      `).toString('base64')
    };

    for (const recipe of recipes) {
      const imageUrl = recipeImages[recipe.name];
      if (imageUrl) {
        await db.recipe.update({
          where: { id: recipe.id },
          data: { imageUrl }
        });
        console.log(`Updated ${recipe.name} with embedded SVG image`);
      }
    }
    
    console.log("All recipe images updated with embedded SVGs!");
  } catch (error) {
    console.error("Error fixing images:", error);
  } finally {
    await db.$disconnect();
  }
}

fixRecipeImagesFinal();