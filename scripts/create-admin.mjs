import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found — check .env.local path and content.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@tokidoki.com";
  const password = "ChangeThisPassword123";
  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashed, isActive: true },
    create: {
      name: "Master Admin",
      email,
      password: hashed,
      permissions: ["all"],
      isActive: true,
    },
  });

  console.log("Admin created/updated:", admin.email);
  process.exit(0);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});