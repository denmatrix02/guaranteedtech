const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      OR: [
        { name: { contains: "Dennis", mode: "insensitive" } },
        { email: "admin@guaranteedtech.ng" },
        { email: "guarateedtech17@gmail.com" },
        { role: "SUPER_ADMIN" }
      ]
    },
    data: {
      name: "Executive Admin"
    }
  });

  console.log(`Updated ${result.count} admin user(s) to 'Executive Admin'.`);

  const admins = await prisma.user.findMany({
    where: { role: "SUPER_ADMIN" },
    select: { id: true, email: true, name: true, role: true }
  });
  console.log("Current Super Admins:", admins);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
