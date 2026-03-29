import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });


async function main() {
    await prisma.team.createMany({
      data: [
        // Group A
        { name: "USA", country: "United States", group: "A" },
        { name: "Morocco", country: "Morocco", group: "A" },
        { name: "Scotland", country: "Scotland", group: "A" },
        { name: "Burkina Faso", country: "Burkina Faso", group: "A" },
        // Group B
        { name: "France", country: "France", group: "B" },
        { name: "Denmark", country: "Denmark", group: "B" },
        { name: "Colombia", country: "Colombia", group: "B" },
        { name: "Bahrain", country: "Bahrain", group: "B" },
        // Group C
        { name: "Brazil", country: "Brazil", group: "C" },
        { name: "Italy", country: "Italy", group: "C" },
        { name: "Paraguay", country: "Paraguay", group: "C" },
        { name: "New Zealand", country: "New Zealand", group: "C" },
        // Group D
        { name: "Argentina", country: "Argentina", group: "D" },
        { name: "Ukraine", country: "Ukraine", group: "D" },
        { name: "Uzbekistan", country: "Uzbekistan", group: "D" },
        { name: "Bolivia", country: "Bolivia", group: "D" },
        // Group E
        { name: "Germany", country: "Germany", group: "E" },
        { name: "Uruguay", country: "Uruguay", group: "E" },
        { name: "Serbia", country: "Serbia", group: "E" },
        { name: "Panama", country: "Panama", group: "E" },
        // Group F
        { name: "Spain", country: "Spain", group: "F" },
        { name: "Nigeria", country: "Nigeria", group: "F" },
        { name: "Ecuador", country: "Ecuador", group: "F" },
        { name: "Trinidad and Tobago", country: "Trinidad and Tobago", group: "F" },
        // Group G
        { name: "England", country: "England", group: "G" },
        { name: "Senegal", country: "Senegal", group: "G" },
        { name: "Qatar", country: "Qatar", group: "G" },
        { name: "Honduras", country: "Honduras", group: "G" },
        // Group H
        { name: "Portugal", country: "Portugal", group: "H" },
        { name: "Mexico", country: "Mexico", group: "H" },
        { name: "Cameroon", country: "Cameroon", group: "H" },
        { name: "Slovenia", country: "Slovenia", group: "H" },
        // Group I
        { name: "Netherlands", country: "Netherlands", group: "I" },
        { name: "Japan", country: "Japan", group: "I" },
        { name: "Iran", country: "Iran", group: "I" },
        { name: "Canada", country: "Canada", group: "I" },
        // Group J
        { name: "Belgium", country: "Belgium", group: "J" },
        { name: "South Korea", country: "South Korea", group: "J" },
        { name: "Saudi Arabia", country: "Saudi Arabia", group: "J" },
        { name: "Australia", country: "Australia", group: "J" },
        // Group K
        { name: "Croatia", country: "Croatia", group: "K" },
        { name: "Egypt", country: "Egypt", group: "K" },
        { name: "Costa Rica", country: "Costa Rica", group: "K" },
        { name: "Albania", country: "Albania", group: "K" },
        // Group L
        { name: "Switzerland", country: "Switzerland", group: "L" },
        { name: "Poland", country: "Poland", group: "L" },
        { name: "Ivory Coast", country: "Ivory Coast", group: "L" },
        { name: "Chile", country: "Chile", group: "L" },
      ],
    })
    console.log("48 teams seeded across 12 groups");
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });