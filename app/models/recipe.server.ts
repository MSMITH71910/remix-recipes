import type { Recipe, Ingredient, PantryItem } from "@prisma/client";
import db from "~/db.server";

export type RecipeWithIngredients = Recipe & {
  ingredients: Ingredient[];
};

export async function updateRecipeMealPlanMultiplier(
  recipeId: string,
  multiplier: number | null
) {
  return db.recipe.update({
    where: { id: recipeId },
    data: { mealPlanMultiplier: multiplier },
  });
}

export async function getRecipeWithIngredients(recipeId: string) {
  return db.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function createRecipe(
  recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
  ingredients: Omit<Ingredient, "id" | "recipeId">[]
) {
  return db.recipe.create({
    data: {
      ...recipe,
      ingredients: {
        create: ingredients,
      },
    },
    include: {
      ingredients: true,
    },
  });
}

export async function deleteRecipe(recipeId: string, userId: string) {
  // First verify the recipe belongs to the user
  const recipe = await db.recipe.findFirst({
    where: { id: recipeId, userId },
  });

  if (!recipe) {
    throw new Error("Recipe not found or access denied");
  }

  return db.recipe.delete({
    where: { id: recipeId },
  });
}