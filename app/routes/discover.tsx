import { useLoaderData } from "react-router";
import { DiscoverGrid, DiscoverListItem } from "~/components/discover";
import db from "~/db.server";

export async function loader() {
  const recipes = await db.recipe.findMany({
    take: 25,
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return { recipes };
}

export default function Discover() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Discover Recipes</h1>
      <DiscoverGrid>
        {data.recipes.map((recipe) => (
          <DiscoverListItem key={recipe.id} recipe={recipe} />
        ))}
      </DiscoverGrid>
    </main>
  );
}