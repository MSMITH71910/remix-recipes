export default function TestSimpleRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Simple Route</h1>
      <p>If you can see this, the route system is working!</p>
      <div className="mt-4">
        <a href="/app" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Back to App</a>
        <a href="/app/recipes" className="bg-green-500 text-white px-4 py-2 rounded">Recipes</a>
      </div>
    </div>
  );
}