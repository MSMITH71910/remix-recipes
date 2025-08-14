import db from "~/db.server";

export async function loader() {
  try {
    // Add quantities to some common items
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Butter' } },
      data: { quantity: '1 stick' }
    });
    
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Brown sugar' } },
      data: { quantity: '1 cup' }
    });
    
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Flour' } },
      data: { quantity: '2 cups' }
    });
    
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Olive oil' } },
      data: { quantity: '1 bottle' }
    });
    
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Eggs' } },
      data: { quantity: '1 dozen' }
    });
    
    await db.groceryItem.updateMany({
      where: { name: { contains: 'Chicken' } },
      data: { quantity: '1 lb' }
    });
    
    return { message: 'Quantities added successfully!' };
  } catch (error) {
    return { error: error.message };
  }
}

export default function FixQuantities() {
  return <div>This page adds quantities to grocery items. Check the console.</div>;
}