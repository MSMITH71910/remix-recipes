import { useLoaderData } from "react-router";
import type { Route } from "./+types/my-recipes";
import db from "~/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) throw new Error("User not found");
  
  const recipes = await db.recipe.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return { recipes, user };
}

export default function MyRecipes() {
  const { recipes, user } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
        <a 
          href="/add-recipe" 
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
              href="/add-recipe" 
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
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={`${recipe.name} recipe`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/recipe-placeholder.svg';
                    }}
                  />
                ) : (
                  <img
                    src="/recipe-placeholder.svg"
                    alt={`${recipe.name} recipe`}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {recipe.totalTime && `⏱ ${recipe.totalTime}`}
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={`/recipe/${recipe.id}`} 
                    className="text-primary hover:text-primary-light font-medium"
                  >
                    View Recipe
                  </a>
                  <a 
                    href={`/recipe/${recipe.id}/edit`} 
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Edit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}