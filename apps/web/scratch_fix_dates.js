process.env.DATABASE_URL = "postgresql://postgres:Ayarin1972%40%23@localhost:5432/bervic_invitation";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetEmail = "annalprincy22@gmail.com";
  const user = await prisma.user.findFirst({ where: { email: targetEmail } });

  if (user) {
    const fixedDate = new Date();
    fixedDate.setMonth(fixedDate.getMonth() + 6); // 6 months from purchase date (Feb 2027)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        planExpiresAt: fixedDate
      }
    });
    console.log(`Updated ${user.email} planExpiresAt to ${fixedDate.toISOString()}`);
  }
}

main().finally(() => prisma.$disconnect());
