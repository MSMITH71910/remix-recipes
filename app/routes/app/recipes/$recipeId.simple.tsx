import { useLoaderData, redirect, Form, useSearchParams } from "react-router";
import type { Route } from "./+types/$recipeId.simple";
import db from "~/db.server";

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: true,
    },
  });

  if (recipe === null) {
    throw new Response("Recipe not found", { status: 404 });
  }

  return { recipe };
}

export async function action({ request, params }: Route.ActionArgs) {
  console.log("Action called! RecipeID:", params.recipeId);
  
  // Get the authenticated user
  const { requireLoggedInUser } = await import("~/utils/auth.server");
  const user = await requireLoggedInUser(request);

  const formData = await request.formData();
  const _action = formData.get("_action");
  
  console.log("Action type:", _action, "User ID:", user.id);

  if (_action === "addToGroceryList") {
    // Get recipe with ingredients
    const recipe = await db.recipe.findUnique({
      where: { id: params.recipeId },
      include: {
        ingredients: {
          select: { name: true }
        }
      }
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Get all current pantry items
    const pantryItems = await db.pantryItem.findMany({
      where: { userId: user.id },
      select: { name: true }
    });

    const pantryItemNames = new Set(pantryItems.map(item => item.name.toLowerCase()));
    const missingIngredients = recipe.ingredients.filter(ingredient => 
      !pantryItemNames.has(ingredient.name.toLowerCase())
    );

    // Add missing ingredients to grocery list
    const { createGroceryItem } = await import("~/models/grocery-item.server");
    
    for (const ingredient of missingIngredients) {
      try {
        await createGroceryItem(user.id, ingredient.name, "recipe");
      } catch (error) {
        console.error(`Failed to add ${ingredient.name} to grocery list:`, error);
      }
    }

    return redirect(`/app/grocery-list`);
  }

  if (_action === "cookRecipe") {
    // Get recipe with ingredients
    const recipe = await db.recipe.findUnique({
      where: { id: params.recipeId },
      include: {
        ingredients: {
          select: { name: true, amount: true }
        }
      }
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Use ingredients from pantry
    const { useRecipeIngredients } = await import("~/utils/use-ingredients.server");
    const results = await useRecipeIngredients(user.id, recipe.ingredients);
    
    return redirect(`/app/recipes/${params.recipeId}/simple?cooked=true&used=${results.length}`);
  }

  return null;
}

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  
  // Check for success message in URL params
  const cooked = searchParams.get('cooked');
  const usedCount = searchParams.get('used');

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Success Message */}
        {cooked === 'true' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">🍽️</span>
              <div>
                <p className="font-semibold">Recipe Cooked Successfully!</p>
                <p className="text-sm">
                  {usedCount && parseInt(usedCount) > 0 
                    ? `${usedCount} ingredients were automatically deducted from your pantry.`
                    : 'No matching ingredients found in your pantry to deduct.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
          <div className="flex space-x-4">
            <Form method="post">
              <button 
                type="submit"
                name="_action" 
                value="cookRecipe"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <span>🍳</span>
                <span>Cook Recipe</span>
              </button>
            </Form>
            <Form method="post">
              <button 
                type="submit"
                name="_action" 
                value="addToGroceryList"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <span>🛒</span>
                <span>Add to Grocery List</span>
              </button>
            </Form>
            <a 
              href={`/app/recipes/${recipe.id}/edit`} 
              className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Edit Recipe
            </a>
            <a 
              href="/app/recipes" 
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to All Recipes
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="h-64 overflow-hidden rounded-lg mb-6">
              <img
                src={recipe.imageUrl || '/recipe-placeholder.svg'}
                alt={`${recipe.name} recipe`}
                className="h-full w-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/recipe-placeholder.svg';
                  e.currentTarget.className = 'h-full w-full object-contain rounded-lg';
                }}
              />
            </div>

            {recipe.totalTime && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-600">⏱</span>
                <span className="text-gray-800 font-medium">{recipe.totalTime}</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-2 mb-8">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                    <span className="text-gray-600">{ingredient.amount || ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-8">No ingredients listed</p>
            )}

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}