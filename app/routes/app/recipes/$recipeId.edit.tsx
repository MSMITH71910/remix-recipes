import { redirect, useLoaderData } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/$recipeId.edit";
import { PrimaryButton, PrimaryInput, ErrorMessage } from "~/components/forms";
import db from "~/db.server";

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          name: true,
          amount: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  
  if (!recipe) {
    throw new Response("Recipe not found", { status: 404 });
  }
  
  return { recipe };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const instructions = formData.get("instructions");
  const totalTime = formData.get("totalTime");
  const imageUrl = formData.get("imageUrl");

  if (!name || typeof name !== "string") {
    return { error: "Recipe name is required" };
  }
  if (!instructions || typeof instructions !== "string") {
    return { error: "Instructions are required" };
  }

  const recipe = await db.recipe.update({
    where: { id: params.recipeId },
    data: {
      name,
      instructions,
      totalTime: totalTime as string || null,
      imageUrl: imageUrl as string || '/recipe-placeholder.svg',
    },
  });

  return redirect(`/app/recipes/${params.recipeId}`);
}

export default function EditRecipe() {
  const { recipe } = useLoaderData<typeof loader>();
  const [ingredients, setIngredients] = useState(
    recipe.ingredients?.map(ing => `${ing.amount} ${ing.name}`) || [""]
  );

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
          <div className="flex space-x-4">
            <a 
              href={`/app/recipes/${recipe.id}`} 
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Recipe
            </a>
            <a 
              href="/app/recipes" 
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              All Recipes
            </a>
          </div>
        </div>

        <form method="post" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name *
            </label>
            <PrimaryInput
              id="name"
              name="name"
              type="text"
              placeholder="Enter recipe name"
              defaultValue={recipe.name}
              required
            />
          </div>

          <div>
            <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700 mb-2">
              Total Time
            </label>
            <PrimaryInput
              id="totalTime"
              name="totalTime"
              type="text"
              placeholder="e.g., 30 minutes"
              defaultValue={recipe.totalTime || ""}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <PrimaryInput
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/recipe-image.jpg"
              defaultValue={recipe.imageUrl || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 1 cup flour"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="text-primary hover:text-primary-light font-medium"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={6}
              placeholder="Enter cooking instructions..."
              defaultValue={recipe.instructions}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <a
              href={`/app/recipes/${recipe.id}`}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
            <PrimaryButton type="submit">
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
}