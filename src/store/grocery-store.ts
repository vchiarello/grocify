import { create } from "zustand";
export type GroceryCategory =
  "Product" | "Dairy" | "Bakery" | "Pantry" | "Snacks";
export type GroceryPriority = "low" | "medium" | "high";
export type GroceryItem = {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  purchased: boolean;
  priority: GroceryPriority;
};
export type CreateItemInput = {
  name: string;
  category: GroceryCategory;
  quantity: number;
  priority: GroceryPriority;
};
type ItemResponse = { item: GroceryItem };
type ItemsResponse = { items: GroceryItem[] };
type GroceryStore = {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
  upddateQuantity: (id: string, quantity: number) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearPurchased: () => Promise<void>;
};

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/items");
      const payload = (await res.json()) as ItemsResponse;

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set({ items: payload.items });
    } catch (error) {
      console.log("Error loading items", error);
      set({ error: "Error loading items" });
    } finally {
      set({ isLoading: false });
    }
  },
  addItem: async (input) => {
    set({ error: null });
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          category: input.category,
          quantity: Math.max(1, Math.floor(input.quantity)),
          priority: input.priority,
        }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      set((state) => ({ items: [payload.item, ...state.items] }));
      return payload.item;
    } catch (error) {
      console.log("Error adding item", error);
      set({ error: "Something went wrong during adding an item." });
    }
  },
  upddateQuantity: async (id, quantity) => {
    const nextQuantity = Math.max(1, quantity);
    set({ error: null });
    try {
      const res = await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          quantity: nextQuantity,
        }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (error) {
      console.log("Error update quantity", error);
      set({ error: "Something went wrong during update an item quantity." });
    }
  },
  togglePurchased: async (id) => {
    const currentItem = get().items.find((item) => item.id === id);
    if (!currentItem) return;
    const nextPurchased = !currentItem.purchased;
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          purchased: nextPurchased,
        }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (error) {
      console.log("Error toggling purchased", error);
      set({
        error: "Something went wrong during toggling an item purchased field.",
      });
    }
  },
  removeItem: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log("Error removing item", error);
      set({ error: "Something went wrong during removing an item." });
    }
  },
  clearPurchased: async () => {
    set({ error: null });
    try {
      const res = await fetch("/api/items/clear-purchased", {
        method: "POST",
      });
      const items = get().items.filter((item) => !item.purchased);
      set({ items });
    } catch (error) {
      console.log("Error clear purchased", error);
      set({ error: "Something went wrong during clear purchased." });
    }
  },
}));
