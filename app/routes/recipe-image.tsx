import { fileStorage, getStorageKey } from "~/recipe-image-storage.server";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.recipeId) {
    throw new Response("Recipe ID is required", { status: 400 });
  }
  const storageKey = getStorageKey(params.recipeId);
  const file = await fileStorage.get(storageKey);

  // File storage is not implemented, always return 404
  throw new Response("Recipe image not found", {
    status: 404,
  });
}