import {
  deleteGroceryItem,
  setGroceryItemPurchased,
  updateGroceryItemQuantity,
} from "@/lib/server/db-action";

export async function DELETE(_request: Request, { id }: { id: string }) {
  try {
    // Call the deleteGroceryItem function with the provided id
    await deleteGroceryItem(id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(`Error in DELETE /api/items/${id}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete grocery item";
    return Response.json(
      { error: errorMessage },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function PATCH(request: Request, { id }: { id: string }) {
  try {
    const body = await request.json();
    const item = body.quantity
      ? await updateGroceryItemQuantity(id, body.quantity)
      : await setGroceryItemPurchased({
          id,
          isPurchased: body.purchased ?? true,
        });
    if (!item)
      return Response.json(
        { error: "Item not found" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    return Response.json({ item });
  } catch (error) {
    console.error(`Error in PATCH /api/items/${id}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update grocery item";
    return Response.json(
      { error: errorMessage },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
