const { PrismaClient } = require("@prisma/client");

async function testConnections() {
  console.log("Testing with DATABASE_URL...");
  const prisma1 = new PrismaClient();
  try {
    const count = await prisma1.user.count();
    console.log("DATABASE_URL success! User count:", count);
  } catch (e) {
    console.log("DATABASE_URL failed:", e.message);
  } finally {
    await prisma1.$disconnect();
  }

  console.log("Testing with DIRECT_URL...");
  const prisma2 = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL
      }
    }
  });
  try {
    const count = await prisma2.user.count();
    console.log("DIRECT_URL success! User count:", count);
    const users = await prisma2.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    console.log("Users:", users);
  } catch (e) {
    console.log("DIRECT_URL failed:", e.message);
  } finally {
    await prisma2.$disconnect();
  }
}

testConnections();
