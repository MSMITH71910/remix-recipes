import type { Route } from "./+types/health";

export function loader({ request }: Route.LoaderArgs) {
  return Response.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}