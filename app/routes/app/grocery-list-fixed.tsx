import { useLoaderData } from "react-router";
import type { Route } from "./+types/grocery-list";
import { z } from "zod";

export async function loader({ request }: Route.LoaderArgs) {
  const db = await import("~/db.server").then(m => m.default);
  const { getAllGroceryItems } = await import("~/models/grocery-item.server");
  
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) throw new Error("User not found");
  
  const groceryItems = await getAllGroceryItems(user.id);

  return { 
    groceryItems,
  };
}

export async function action({ request }: Route.ActionArgs) {
  // Debug logging
  require('fs').writeFileSync('/tmp/action_working.txt', `ACTION CALLED: ${new Date().toISOString()}\n`, { flag: 'a' });
  
  const db = await import("~/db.server").then(m => m.default);
  const { toggleGroceryItem } = await import("~/models/grocery-item.server");
  const { createShelfItem } = await import("~/models/pantry-item.server");
  
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) throw new Error("User not found");

  const formData = await request.formData();
  const action = formData.get("_action");
  const itemId = formData.get("itemId") as string;

  require('fs').writeFileSync('/tmp/action_working.txt', `Action: ${action}, ItemId: ${itemId}\n`, { flag: 'a' });

  if (action === "toggleItem" && itemId) {
    // Get grocery item BEFORE toggling to check if it needs restoration
    const groceryItem = await db.groceryItem.findUnique({
      where: { id: itemId }
    });
    
    if (groceryItem && groceryItem.source && !groceryItem.completed) {
      // Item is being completed - restore to pantry
      let shelf;
      
      if (groceryItem.source === "recipe") {
        shelf = await db.pantryShelf.findFirst({
          where: { 
            userId: user.id,
            name: { equals: "Pantry", mode: 'insensitive' }
          }
        });
      } else {
        shelf = await db.pantryShelf.findFirst({
          where: { 
            userId: user.id,
            name: { equals: groceryItem.source, mode: 'insensitive' }
          }
        });
      }
      
      // Fallback to any shelf
      if (!shelf) {
        shelf = await db.pantryShelf.findFirst({
          where: { userId: user.id }
        });
      }
      
      if (shelf) {
        await createShelfItem(user.id, shelf.id, groceryItem.name, groceryItem.quantity);
        require('fs').writeFileSync('/tmp/action_working.txt', `RESTORED: ${groceryItem.name} to ${shelf.name}\n`, { flag: 'a' });
      }
    }
    
    // Toggle the completion status
    await toggleGroceryItem(itemId);
  }

  return { success: true };
}

export default function GroceryList() {
  const { groceryItems } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Grocery List (Fixed)</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {groceryItems.map((item) => (
              <form method="post" key={item.id}>
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="_action" value="toggleItem" />
                <div className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 ${item.completed ? 'opacity-50 bg-gray-50' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={item.completed}
                    onChange={(e) => {
                      e.currentTarget.form?.submit();
                    }}
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded" 
                  />
                  <div className="flex-grow">
                    <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.name}
                    </span>
                    {item.quantity && (
                      <span className={`text-sm ml-2 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({item.quantity})
                      </span>
                    )}
                    {item.source && (
                      <span className="text-gray-500 text-sm ml-2">
                        (from {item.source})
                      </span>
                    )}
                  </div>
                </div>
              </form>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}