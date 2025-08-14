import db from "~/db.server";

export function createGroceryItem(userId: string, name: string, source?: string, quantity?: string) {
  return db.groceryItem.create({
    data: {
      userId,
      name,
      quantity,
      source,
    },
  });
}

export function getAllGroceryItems(userId: string) {
  return db.groceryItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function toggleGroceryItem(itemId: string) {
  return db.groceryItem.findFirst({
    where: { id: itemId }
  }).then(item => {
    if (!item) return null;
    return db.groceryItem.update({
      where: { id: itemId },
      data: { completed: !item.completed }
    });
  });
}

export function deleteGroceryItem(itemId: string) {
  return db.groceryItem.delete({
    where: { id: itemId },
  });
}

export function clearCompletedGroceryItems(userId: string) {
  return db.groceryItem.deleteMany({
    where: {
      userId,
      completed: true,
    },
  });
}

export function clearAllGroceryItems(userId: string) {
  return db.groceryItem.deleteMany({
    where: {
      userId,
    },
  });
}