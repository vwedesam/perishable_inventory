import prisma from "../prisma";

async function cleanupExpiredRecords() {
  await prisma.lot.deleteMany({
    where: {
      expiry: { lt: new Date() },
    },
  });
}

cleanupExpiredRecords()
  .then(() => {
    console.log('Expired records cleaned up successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error cleaning up expired records:', error);
    process.exit(1);
  });
