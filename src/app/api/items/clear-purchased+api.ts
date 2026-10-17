import { clearGroceryItems } from "@/lib/server/db-action";

export async function POST() {
  try {
    await clearGroceryItems();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error in POST /api/items/clear-purchased:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to clear purchased items";
    return Response.json(
      { error: errorMessage },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
