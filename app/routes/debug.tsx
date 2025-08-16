export default function Debug() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>This route works!</p>
      <div className="mt-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Go to Login</a>
        <a href="/app" className="bg-green-500 text-white px-4 py-2 rounded mr-4">Go to App</a>
        <a href="/test-login" className="bg-purple-500 text-white px-4 py-2 rounded">Test Login</a>
      </div>
    </div>
  );
}