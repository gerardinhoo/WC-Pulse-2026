import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });


async function main() {
    await prisma.team.createMany({
      data: [
        { name: "USA", country: "USA", group: "A" },
        { name: "France", country: "France", group: "B" },
        { name: "Brazil", country: "Brazil", group: "C" },
        { name: "Argentina", country: "Argentina", group: "D" },
        { name: "Germany", country: "Germany", group: "E" },
        { name: "Spain", country: "Spain", group: "F" },
    ],
    })
    console.log("Teams seeded");
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });