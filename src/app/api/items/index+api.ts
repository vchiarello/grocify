import {
  createGroceryItem,
  listGroceryItems
} from "@/lib/server/db-action";

export async function GET(request: Request) {
  try {
    const items = await listGroceryItems();
    return Response.json({ items });
  } catch (error) {
    console.error("Error in GET /api/items:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch grocery items";
    return Response.json(
      { error: errorMessage },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, quantity, priority } = body;

    if (!name || !category || !priority) {
      return Response.json(
        { error: "Missing required fields" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const newItem = await createGroceryItem({
      name,
      category,
      quantity,
      priority,
    });

    return Response.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/items:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create grocery item";
    return Response.json(
      { error: errorMessage },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
