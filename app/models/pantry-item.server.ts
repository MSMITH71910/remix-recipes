import db from "~/db.server";
import { handleDelete } from "./utils";

export function createShelfItem(userId: string, shelfId: string, name: string, quantity?: string) {
  return db.pantryItem.create({
    data: {
      userId,
      shelfId,
      name,
      quantity,
    },
  });
}

export function deleteShelfItem(id: string) {
  return handleDelete(() =>
    db.pantryItem.delete({
      where: {
        id,
      },
    })
  );
}

export function getShelfItem(id: string) {
  return db.pantryItem.findUnique({ where: { id } });
}

export function updateShelfItemQuantity(id: string, newQuantity: string) {
  return db.pantryItem.update({
    where: { id },
    data: { quantity: newQuantity }
  });
}

export function getPantryItemByName(userId: string, itemName: string) {
  return db.pantryItem.findFirst({
    where: {
      userId,
      name: {
        contains: itemName,
        mode: 'insensitive'
      }
    }
  });
}