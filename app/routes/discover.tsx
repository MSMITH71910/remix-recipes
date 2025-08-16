import { useLoaderData } from "react-router";
import { DiscoverGrid, DiscoverListItem } from "~/components/discover";
import db from "~/db.server";

export async function loader() {
  try {
    const recipes = await db.recipe.findMany({
      take: 25,
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    return { recipes };
  } catch (error) {
    console.error("Database error in discover route:", error);
    // Return empty recipes if database fails
    return { recipes: [] };
  }
}

export default function Discover() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Discover Recipes</h1>
      {data.recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🍳</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No recipes found</h2>
            <p className="text-gray-600 mb-6">
              The database is empty. Please check if the seeding process completed successfully.
            </p>
          </div>
        </div>
      ) : (
        <DiscoverGrid>
          {data.recipes.map((recipe) => (
            <DiscoverListItem key={recipe.id} recipe={recipe} />
          ))}
        </DiscoverGrid>
      )}
    </main>
  );
}