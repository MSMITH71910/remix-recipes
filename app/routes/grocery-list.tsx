import { useLoaderData } from "react-router";
import type { Route } from "./+types/grocery-list";
import db from "~/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) throw new Error("User not found");
  
  // Get recipes with meal plan multipliers
  const recipesWithMultipliers = await db.recipe.findMany({
    where: { 
      userId: user.id,
      mealPlanMultiplier: { not: null }
    },
    include: { 
      ingredients: true 
    },
    orderBy: { updatedAt: "desc" }
  });

  // Calculate grocery list
  const groceryItems = new Map();
  
  recipesWithMultipliers.forEach(recipe => {
    const multiplier = recipe.mealPlanMultiplier || 1;
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      if (groceryItems.has(key)) {
        const existing = groceryItems.get(key);
        existing.amount = `${existing.amount} + ${ingredient.amount || ''} (${recipe.name})`.trim();
      } else {
        groceryItems.set(key, {
          name: ingredient.name,
          amount: `${ingredient.amount || ''} (${recipe.name})`.trim(),
          id: ingredient.id,
          recipeId: recipe.id
        });
      }
    });
  });

  return { 
    groceryItems: Array.from(groceryItems.values()),
    recipesCount: recipesWithMultipliers.length
  };
}

export default function GroceryList() {
  const { groceryItems, recipesCount } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grocery List</h1>
            <p className="text-gray-600 mt-2">
              Generated from {recipesCount} meal plan {recipesCount === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>
          <button className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md font-medium transition-colors">
            Print List
          </button>
        </div>

        {groceryItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No items in your grocery list</h2>
            <p className="text-gray-600 mb-6">
              Add recipes to your meal plan to generate a grocery list automatically.
            </p>
            <a 
              href="/my-recipes" 
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse My Recipes
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Shopping List</h2>
              <p className="text-sm text-gray-600">
                Check off items as you shop. Tap items to mark as complete.
              </p>
            </div>

            <div className="space-y-2">
              {groceryItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded" 
                  />
                  <div className="flex-grow">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    {item.amount && (
                      <span className="text-gray-600 text-sm ml-2">{item.amount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Organize your list by store sections (produce, dairy, etc.)</li>
                <li>• Check your pantry before shopping to avoid duplicates</li>
                <li>• Consider buying in bulk for frequently used ingredients</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}