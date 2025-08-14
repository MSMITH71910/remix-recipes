export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <img 
          src="/logo-light.svg" 
          alt="Remix Recipes Logo" 
          className="w-32 h-32 block dark:hidden"
        />
        <img 
          src="/logo-dark.svg" 
          alt="Remix Recipes Logo" 
          className="w-32 h-32 hidden dark:block"
        />
        
        <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to Remix Recipes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Organize your recipes, manage your pantry, and create meal plans all in one place.
          </p>
          
          <div className="flex justify-center gap-4 pt-6">
            <a 
              href="/discover" 
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Discover Recipes
            </a>
            <a 
              href="/login" 
              className="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}