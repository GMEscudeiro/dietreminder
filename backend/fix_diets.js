
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.dietas.updateMany({
    where: { Ativa: null },
    data: { Ativa: true }
  });
  console.log(`Updated ${result.count} diets from NULL to true`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
