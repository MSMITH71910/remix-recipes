import { redirect } from "react-router";
import type { Route } from "./+types/update-meal-plan";
import { requireLoggedInUser } from "~/utils/auth.server";
import { updateRecipeMealPlanMultiplier } from "~/models/recipe.server";

export async function action({ request, params }: Route.ActionArgs) {
  await requireLoggedInUser(request);
  
  const formData = await request.formData();
  const multiplier = formData.get("multiplier");
  
  if (typeof multiplier !== "string" || !params.recipeId) {
    throw new Error("Invalid form data");
  }
  
  const multiplierValue = multiplier === "" ? null : parseFloat(multiplier);
  
  await updateRecipeMealPlanMultiplier(params.recipeId, multiplierValue);
  
  return redirect(`/app/recipes/${params.recipeId}`);
}