import { useLoaderData } from "react-router";
import type { Route } from "./+types/grocery-list";
import { z } from "zod";
import db from "~/db.server";
import { getAllGroceryItems, toggleGroceryItem, clearCompletedGroceryItems, clearAllGroceryItems } from "~/models/grocery-item.server";
import { createShelfItem } from "~/models/pantry-item.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) {
    return { groceryItems: [] };
  }
  
  const groceryItems = await getAllGroceryItems(user.id);

  return { 
    groceryItems,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await db.user.findFirst({ where: { email: "test@example.com" } });
  if (!user) {
    return { success: false, error: "Please log in to perform this action" };
  }

  const formData = await request.formData();
  const action = formData.get("_action");
  const itemId = formData.get("itemId") as string;



  if (action === "toggleItem" && itemId) {
    // Get grocery item BEFORE toggling to check if it needs restoration
    const groceryItem = await (db as any).groceryItem.findFirst({
      where: { id: itemId }
    });
    
    if (groceryItem && groceryItem.source && !groceryItem.completed) {
      // Item is being completed - restore to appropriate shelf
      let shelf;
      
      // Determine the appropriate shelf based on item type
      const getShelfForItem = (itemName: string, source: string) => {
        const itemLower = itemName.toLowerCase();
        
        // Refrigerator items
        if (itemLower.includes('butter') || 
            itemLower.includes('milk') || 
            itemLower.includes('cheese') ||
            itemLower.includes('eggs') ||
            itemLower.includes('yogurt') ||
            itemLower.includes('cream') ||
            itemLower.includes('chicken') ||
            itemLower.includes('meat') ||
            itemLower.includes('beef') ||
            itemLower.includes('fish') ||
            itemLower.includes('cucumber') ||
            itemLower.includes('lettuce') ||
            itemLower.includes('vegetables') && !itemLower.includes('mixed')) {
          return "Refrigerator";
        }
        
        // Pantry items (dry goods, oils, condiments)
        if (itemLower.includes('flour') ||
            itemLower.includes('sugar') ||
            itemLower.includes('oil') ||
            itemLower.includes('sauce') ||
            itemLower.includes('spice') ||
            itemLower.includes('salt') ||
            itemLower.includes('pepper') ||
            itemLower.includes('pasta') ||
            itemLower.includes('rice') ||
            itemLower.includes('beans') ||
            itemLower.includes('lemon') ||
            itemLower.includes('onion') ||
            itemLower.includes('tomato') ||
            itemLower.includes('chocolate') ||
            itemLower.includes('mixed vegetables')) {
          return "Pantry";
        }
        
        // If source is not "recipe", use the original shelf
        if (source && source !== "recipe") {
          return source;
        }
        
        // Default to Pantry for unknown items
        return "Pantry";
      };
      
      const targetShelfName = getShelfForItem(groceryItem.name, groceryItem.source);
      
      // Find the target shelf
      shelf = await (db as any).pantryShelf.findFirst({
        where: { 
          userId: user.id,
          name: targetShelfName
        }
      });
      
      // Fallback to any shelf if target doesn't exist
      if (!shelf) {
        shelf = await (db as any).pantryShelf.findFirst({
          where: { userId: user.id }
        });
      }
      
      if (shelf) {
        await createShelfItem(user.id, shelf.id, groceryItem.name, groceryItem.quantity);

      }
    }
    
    // Toggle the completion status
    await toggleGroceryItem(itemId);
  }

  if (action === "clearCompleted") {
    await clearCompletedGroceryItems(user.id);
    return { success: true, message: "Completed items cleared" };
  }

  if (action === "clearAll") {
    await clearAllGroceryItems(user.id);
    return { success: true, message: "All items cleared" };
  }

  return { success: true };
}

export default function GroceryList() {
  const { groceryItems } = useLoaderData<typeof loader>();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🛒 Shopping List</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <form method="post" style={{ display: 'inline' }}>
              <button 
                type="submit" 
                name="_action" 
                value="clearCompleted"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                onClick={(e) => {
                  if (!confirm("Clear all completed items?")) {
                    e.preventDefault();
                  }
                }}
              >
                Clear Completed
              </button>
            </form>
            <form method="post" style={{ display: 'inline' }}>
              <button 
                type="submit" 
                name="_action" 
                value="clearAll"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                onClick={(e) => {
                  if (!confirm("Clear ALL items? This cannot be undone!")) {
                    e.preventDefault();
                  }
                }}
              >
                Clear All
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {groceryItems.map((item: any) => (
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