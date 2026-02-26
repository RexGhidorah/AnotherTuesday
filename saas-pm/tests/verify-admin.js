const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Verifying Admin User...');
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (user && user.role === 'SUPER_ADMIN') {
    console.log('✅ Super Admin exists.');
  } else {
    console.error('❌ Super Admin missing or incorrect role.');
    process.exit(1);
  }

  console.log('Verifying Workspace Creation (DB Level)...');
  const ws = await prisma.workspace.create({
    data: {
      name: 'Test Workspace',
      slug: 'test-workspace',
    }
  });
  console.log(`✅ Workspace created: ${ws.name}`);

  // Cleanup
  await prisma.workspace.delete({ where: { id: ws.id } });
  console.log('✅ Cleanup successful.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
