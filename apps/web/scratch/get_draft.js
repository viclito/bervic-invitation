const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const drafts = await prisma.userDraftDetails.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 3,
  });
  console.log(JSON.stringify(drafts, null, 2));
}

main().finally(() => prisma.$disconnect());
