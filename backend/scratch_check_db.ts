
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const meals = await prisma.refeicoes.findMany();
  console.log(JSON.stringify(meals, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  , 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
