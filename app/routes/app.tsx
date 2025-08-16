import { PageLayout } from "~/components/layout";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Import server-only modules inside server functions only
  const { requireLoggedInUser } = await import("~/utils/auth.server");
  
  // Require authenticated user for all /app routes
  await requireLoggedInUser(request);
  
  return null;
}

export default function App() {
  return (
    <PageLayout
      title="App"
      links={[
        { to: "recipes", label: "Recipes" },
        { to: "pantry", label: "Pantry" },
        { to: "grocery-list", label: "Grocery List" },
      ]}
    />
  );
}