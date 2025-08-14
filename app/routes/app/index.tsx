export default function AppIndex() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Recipe App</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <a href="/app/recipes" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Recipes</h2>
          <p className="text-gray-600">View and manage your recipe collection</p>
        </a>
        <a href="/app/pantry" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pantry</h2>
          <p className="text-gray-600">Track your ingredients and supplies</p>
        </a>
        <a href="/app/grocery-list" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Grocery List</h2>
          <p className="text-gray-600">Generate shopping lists from recipes</p>
        </a>
      </div>
    </div>
  );
}