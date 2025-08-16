import { getPantryItemByName, updateShelfItemQuantity } from "~/models/pantry-item.server";

export async function useRecipeIngredients(userId: string, ingredients: Array<{ name: string; amount?: string | null }>) {
  const results = [];
  
  for (const ingredient of ingredients) {
    // Find matching pantry item
    const pantryItem = await getPantryItemByName(userId, ingredient.name);
    
    if (pantryItem && pantryItem.quantity) {
      try {
        // Parse current quantity (assume it's a number for now)
        const currentQty = parseInt(pantryItem.quantity) || 0;
        
        if (currentQty > 0) {
          // Reduce by 1 (or parse amount if specified)
          let reduction = 1;
          if (ingredient.amount) {
            const amountMatch = ingredient.amount.match(/(\d+)/);
            if (amountMatch) {
              reduction = parseInt(amountMatch[1]) || 1;
            }
          }
          
          const newQty = Math.max(0, currentQty - reduction);
          await updateShelfItemQuantity(pantryItem.id, newQty.toString());
          
          results.push({
            name: ingredient.name,
            reduced: reduction,
            oldQuantity: currentQty,
            newQuantity: newQty
          });
        }
      } catch (error) {
        console.error(`Failed to reduce quantity for ${ingredient.name}:`, error);
      }
    }
  }
  
  return results;
}

// Helper function to extract numbers from amount strings like "2 cups", "500g", etc.
function extractQuantityFromAmount(amount: string): number {
  const match = amount.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 1;
}