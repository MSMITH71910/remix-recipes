import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCurrentUser } = await import("~/utils/auth.server");
  const user = await getCurrentUser(request);
  
  return {
    user,
    hasUser: !!user,
    userId: user?.id || null,
    email: user?.email || null
  };
}

export default function TestLogin() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Login Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>Has User:</strong> {data.hasUser ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {data.userId || 'None'}</p>
        <p><strong>Email:</strong> {data.email || 'None'}</p>
        <pre>{JSON.stringify(data.user, null, 2)}</pre>
      </div>
      <div className="mt-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Go to Login</a>
        <a href="/app" className="bg-green-500 text-white px-4 py-2 rounded">Go to App</a>
      </div>
    </div>
  );
}