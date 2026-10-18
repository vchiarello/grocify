import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItems } from "./db/schema";

export const listGroceryItems = async () => {
  const items = await db
    .select()
    .from(groceryItems)
    .orderBy(desc(groceryItems.updated_at));
  return items;
};

export const createGroceryItem = async (input: {
  name: string;
  category: string;
  quantity: number;
  priority: string;
}) => {
  const [item] = await db
    .insert(groceryItems)
    .values({
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      quantity: Math.max(1, Math.floor(input.quantity)),
      priority: input.priority,
      isPurchased: false,
      updated_at: Date.now(),
    })
    .returning();

  return item;
};

export const setGroceryItemPurchased = async (input: {
  id: string;
  isPurchased: boolean;
}) => {
  const items = await db
    .update(groceryItems)
    .set({ isPurchased: input.isPurchased, updated_at: Date.now() })
    .where(eq(groceryItems.id, input.id))
    .returning();

  if (!items.length) return null;

  return items[0];
};

export const updateGroceryItemQuantity = async (
  id: string,
  quantity: number,
) => {
  console.log("updateGroceryItemQuantity", id, quantity);
  const items = await db
    .update(groceryItems)
    .set({
      quantity: Math.max(1, Math.floor(quantity)),
      updated_at: Date.now(),
    })
    .where(eq(groceryItems.id, id))
    .returning();

  if (!items.length) return null;

  return items[0];
};

export const deleteGroceryItem = async (id: string) => {
  await db.delete(groceryItems).where(eq(groceryItems.id, id));
};

export const clearGroceryItems = async () => {
  await db.delete(groceryItems).where(eq(groceryItems.isPurchased, true));
};
