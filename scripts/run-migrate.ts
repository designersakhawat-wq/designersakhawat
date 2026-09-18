/**
 * Standalone migration runner — run with: npx tsx scripts/run-migrate.ts
 */
import * as dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { migrate, seed } from "../src/lib/db/migrate";

async function main() {
  try {
    await migrate();
    await seed();
    console.log("✅ All done.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

main();
