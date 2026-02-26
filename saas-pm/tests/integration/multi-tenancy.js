const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- INTEGRATION TEST: MULTI-TENANCY ---');

  // 1. Setup Data
  const userA = await prisma.user.create({ data: { email: 'userA@test.com', role: 'MEMBER' } });
  const userB = await prisma.user.create({ data: { email: 'userB@test.com', role: 'MEMBER' } });

  const wsA = await prisma.workspace.create({ data: { name: 'WS A', slug: 'ws-a' } });
  const wsB = await prisma.workspace.create({ data: { name: 'WS B', slug: 'ws-b' } });

  await prisma.workspaceMember.create({ data: { userId: userA.id, workspaceId: wsA.id } });
  await prisma.workspaceMember.create({ data: { userId: userB.id, workspaceId: wsB.id } });

  const projA = await prisma.project.create({ data: { name: 'Project A', workspaceId: wsA.id } });
  const projB = await prisma.project.create({ data: { name: 'Project B', workspaceId: wsB.id } });

  // 2. Verify Access Logic (Simulated)
  // Check if User A can access Project B (Should be NO)
  const userAAccessToProjB = await prisma.project.findFirst({
    where: {
      id: projB.id,
      workspace: {
        members: {
          some: {
            userId: userA.id
          }
        }
      }
    }
  });

  if (userAAccessToProjB) {
    console.error('❌ FAILURE: User A accessed Project B data!');
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: User A cannot access Project B data.');
  }

  // Check if User A can access Project A (Should be YES)
  const userAAccessToProjA = await prisma.project.findFirst({
    where: {
      id: projA.id,
      workspace: {
        members: {
          some: {
            userId: userA.id
          }
        }
      }
    }
  });

  if (userAAccessToProjA) {
    console.log('✅ SUCCESS: User A can access Project A data.');
  } else {
    console.error('❌ FAILURE: User A cannot access their own data!');
    process.exit(1);
  }

  // 3. Verify Activity Log
  await prisma.activityLog.create({
    data: {
      action: 'TEST_ACTION',
      userId: userA.id,
      details: 'Integration Test'
    }
  });
  const log = await prisma.activityLog.findFirst({ where: { userId: userA.id } });
  if(log) console.log('✅ SUCCESS: Activity Log created.');

  // Cleanup
  await prisma.user.deleteMany({ where: { email: { in: ['userA@test.com', 'userB@test.com'] } } });
  await prisma.workspace.deleteMany({ where: { id: { in: [wsA.id, wsB.id] } } });
  console.log('--- CLEANUP COMPLETE ---');
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
