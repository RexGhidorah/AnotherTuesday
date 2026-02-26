const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// In older/newer versions of Prisma, trying to pass datasources might be redundant if env is set.
// Let's rely purely on the environment variable which is standard.
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log({ user });
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
