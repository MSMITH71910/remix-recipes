import { redirect, useActionData } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/new";
import { createRecipe } from "~/models/recipe.server";
import { PrimaryButton, PrimaryInput, ErrorMessage } from "~/components/forms";
import db from "~/db.server";

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await db.user.findFirst({ where: { email: "test@example.com" } });
    if (!user) {
      return { error: "Please log in to create a recipe" };
    }
    
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

    // Get all ingredient fields from form data
    const ingredients: Array<{ name: string; amount?: string }> = [];
    const formEntries = Array.from(formData.entries());
    
    formEntries.forEach(([key, value]) => {
      if (key.startsWith("ingredient_") && value && typeof value === "string" && value.trim()) {
        // Parse ingredient format: "1 cup flour" -> { name: "flour", amount: "1 cup" }
        const ingredientText = value.trim();
        const parts = ingredientText.split(" ");
        
        // Try to detect amount (numbers or fractions at the start)
        const amountPattern = /^(\d+\/?\d*\.?\d*)\s*(\w+)?\s*/;
        const match = ingredientText.match(amountPattern);
        
        if (match && match[1]) {
          const amount = (match[1] + " " + (match[2] || "")).trim();
          const name = ingredientText.replace(amountPattern, "").trim();
          ingredients.push({ name: name || ingredientText, amount });
        } else {
          ingredients.push({ name: ingredientText });
        }
      }
    });

    const recipe = await createRecipe({
      name,
      instructions,
      totalTime: totalTime as string || null,
      imageUrl: imageUrl as string || '/recipe-placeholder.svg',
      userId: user.id,
    }, ingredients);

    return redirect(`/app/recipes`);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { error: "Failed to create recipe. Please try again." };
  }
}

export default function AddRecipe() {
  const actionData = useActionData<typeof action>();
  const [ingredients, setIngredients] = useState([""]);

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Recipe</h1>
          <a 
            href="/app/recipes" 
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to My Recipes
          </a>
        </div>

        <form method="post" className="space-y-6">
          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {actionData.error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name *
            </label>
            <PrimaryInput
              id="name"
              name="name"
              type="text"
              placeholder="Enter recipe name"
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
                    name={`ingredient_${index}`}
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <a
              href="/app/recipes"
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
            <PrimaryButton type="submit">
              Create Recipe
            </PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
}