const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'admin@example.com';
  const password = 'password123';
  const hashedPassword = await hash(password, 12);

  console.log(`Resetting password for ${email}...`);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      },
      create: {
        email,
        name: 'Admin User',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });
    console.log('✅ Password reset successful.');
  } catch (error) {
    console.error('❌ Failed to reset password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
