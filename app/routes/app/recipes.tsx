import { useLoaderData } from "react-router";
import type { Route } from "./+types/recipes";
import db from "~/db.server";
import { deleteRecipe } from "~/models/recipe.server";
import { z } from "zod";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await db.user.findFirst({ where: { email: "test@example.com" } });
    
    if (!user) {
      // If no test user exists, return empty data
      console.log("No test user found, returning empty recipes");
      return { recipes: [], user: null };
    }
    
    const recipes = await db.recipe.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return { recipes, user };
  } catch (error) {
    console.error("Error in recipes loader:", error);
    // Return empty data if database fails
    return { recipes: [], user: null };
  }
}

const deleteSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

export async function action({ request }: Route.ActionArgs) {
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) {
    return { 
      success: false, 
      error: "Please log in to perform this action" 
    };
  }

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "deleteRecipe") {
    const result = deleteSchema.safeParse({
      recipeId: formData.get("recipeId"),
    });

    if (!result.success) {
      return { 
        success: false, 
        errors: result.error.flatten().fieldErrors 
      };
    }

    try {
      await deleteRecipe(result.data.recipeId, user.id);
      return { 
        success: true, 
        message: "Recipe deleted successfully" 
      };
    } catch (error) {
      return { 
        success: false, 
        error: "Failed to delete recipe" 
      };
    }
  }

  return { success: false, error: "Invalid action" };
}

export default function MyRecipes() {
  const { recipes, user } = useLoaderData<typeof loader>();
  
  // Handle case where no user is found
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your recipes.
            </p>
            <a 
              href="/login" 
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
        <a 
          href="/app/recipes/new" 
          className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
        >
          <span className="text-lg">+</span>
          <span>Add Recipe</span>
        </a>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">👨‍🍳</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No recipes yet!</h2>
            <p className="text-gray-600 mb-6">
              Start building your recipe collection by adding your first recipe.
            </p>
            <a 
              href="/app/recipes/new" 
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span className="text-lg">+</span>
              <span>Add Your First Recipe</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={recipe.imageUrl || '/recipe-placeholder.svg'}
                  alt={`${recipe.name} recipe`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/recipe-placeholder.svg';
                    e.currentTarget.className = 'h-full w-full object-contain';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {recipe.totalTime && `⏱ ${recipe.totalTime}`}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={`/app/recipes/${recipe.id}`} 
                    className="text-primary hover:text-primary-light font-medium"
                  >
                    View Recipe
                  </a>
                  <div className="flex items-center space-x-3">
                    <a 
                      href={`/app/recipes/${recipe.id}/edit`} 
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Edit
                    </a>
                    <form method="post" style={{ display: 'inline' }}>
                      <input type="hidden" name="recipeId" value={recipe.id} />
                      <button
                        type="submit"
                        name="_action"
                        value="deleteRecipe"
                        className="text-red-600 hover:text-red-800 text-sm sm:text-base px-2 py-1 rounded touch-manipulation min-h-[44px] sm:min-h-[auto] flex items-center justify-center"
                        onClick={(e) => {
                          if (!confirm(`Are you sure you want to delete "${recipe.name}"? This cannot be undone!`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}