const { neon } = require("@neondatabase/serverless");
const crypto = require("node:crypto");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = neon(databaseUrl);

const groceryItems = [
  {
    name: "Bananas",
    category: "Produce",
    quantity: 6,
    priority: "medium",
    purchased: false,
  },
  {
    name: "Apples",
    category: "Fruits",
    quantity: 5,
    priority: "high",
    purchased: false,
  },
  {
    name: "Oranges",
    category: "Fruits",
    quantity: 4,
    priority: "medium",
    purchased: false,
  },
  {
    name: "Grapes",
    category: "Fruits",
    quantity: 3,
    priority: "low",
    purchased: false,
  },
  {
    name: "Strawberries",
    category: "Fruits",
    quantity: 2,
    priority: "high",
    purchased: false,
  },
  {
    name: "Blueberries",
    category: "Fruits",
    quantity: 1,
    priority: "medium",
    purchased: false,
  },
  {
    name: "Raspberries",
    category: "Fruits",
    quantity: 1,
    priority: "low",
    purchased: false,
  },
  {
    name: "Pineapple",
    category: "Fruits",
    quantity: 1,
    priority: "medium",
    purchased: false,
  },
  {
    name: "Mangoes",
    category: "Fruits",
    quantity: 2,
    priority: "high",
    purchased: false,
  },
  {
    name: "Watermelon",
    category: "Fruits",
    quantity: 1,
    priority: "low",
    purchased: false,
  },
  {
    name: "Cantaloupe",
    category: "Fruits",
    quantity: 1,
    priority: "medium",
    purchased: false,
  },
  {
    name: "Honeydew",
    category: "Fruits",
    quantity: 1,
    priority: "low",
    purchased: false,
  },
];

async function seed() {
  await client`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        purchased BOOLEAN NOT NULL DEFAULT FALSE,
        priority TEXT NOT NULL DEFAULT 'medium',
        updated_at BIGINT NOT NULL
      );
    `;

  for (const item of groceryItems) {
    const id = crypto.randomUUID();

    const updatedAt = Date.now();
    await client`
      INSERT INTO grocery_items (id, name, category, quantity, is_purchased, priority, updated_at)
      VALUES (${id}, ${item.name}, ${item.category}, ${item.quantity}, ${item.purchased}, ${item.priority}, ${updatedAt});
    `;
  }
  console.log(`Seed completed. Inserted ${groceryItems.length} grocery items.`);
}
console.log(process.env.DATABASE_URL);

seed().catch((error) => {
  console.error("Error seeding the database:", error);
  process.exit(1);
});
