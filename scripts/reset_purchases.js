const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Full Database Reset for Non-Admin Users (Purchases, Subscriptions, Saved Invitations & Cards)...");

  // Fetch admin user ID
  const adminUser = await prisma.user.findUnique({
    where: { email: "berglin1998@gmail.com" },
    select: { id: true },
  });

  const adminUserId = adminUser ? adminUser.id : null;

  // 1. Delete all Subscription records
  const deletedSubs = await prisma.subscription.deleteMany({});
  console.log(`Deleted ${deletedSubs.count} subscription records.`);

  // 2. Delete all Payment records
  const deletedPayments = await prisma.payment.deleteMany({});
  console.log(`Deleted ${deletedPayments.count} payment records.`);

  // 3. Delete non-admin UserInvitation records
  const deletedInvs = await prisma.userInvitation.deleteMany({
    where: adminUserId
      ? { NOT: { userId: adminUserId } }
      : {},
  });
  console.log(`Deleted ${deletedInvs.count} non-admin user invitations.`);

  // 4. Delete non-admin UserCard records
  const deletedCards = await prisma.userCard.deleteMany({
    where: adminUserId
      ? { NOT: { userId: adminUserId } }
      : {},
  });
  console.log(`Deleted ${deletedCards.count} non-admin user cards.`);

  // 5. Reset all non-admin users to plan = "NONE", allowedTemplatesCount = 0, allowedCardsCount = 0, planExpiresAt = null
  const resetUsers = await prisma.user.updateMany({
    where: {
      NOT: {
        email: "berglin1998@gmail.com",
      },
    },
    data: {
      plan: "NONE",
      planExpiresAt: null,
      allowedTemplatesCount: 0,
      allowedCardsCount: 0,
    },
  });
  console.log(`Reset ${resetUsers.count} non-admin user accounts.`);

  // 6. Ensure admin user has CINEMATIC_2000 pass
  await prisma.user.updateMany({
    where: {
      email: "berglin1998@gmail.com",
    },
    data: {
      plan: "CINEMATIC_2000",
      allowedTemplatesCount: 99,
      allowedCardsCount: 99,
    },
  });
  console.log("Updated admin account (berglin1998@gmail.com) with full pass.");

  console.log("Full Database Reset Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Reset script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
