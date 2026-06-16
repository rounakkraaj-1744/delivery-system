import { PrismaClient } from './src/generated/prisma/client.ts';
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@delivery.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@delivery.com",
      username: "AdminUser",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Seed successful:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
