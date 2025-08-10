import { prismaClient } from "./src";

async function seed() {
  // Create a user
  const user = await prismaClient.user.create({
    data: {
      id: "15", // ✅ Match this ID below
      email: "test@test.com",
    },
  });

  // Create Validators
  const validator1 = await prismaClient.validator.create({
    data: {
      publicKey: '0xVALIDATOR1KEY',
      location: 'San Francisco, USA',
      ip: '192.168.0.1',
    },
  });

  const validator2 = await prismaClient.validator.create({
    data: {
      publicKey: '0xVALIDATOR2KEY',
      location: 'Berlin, Germany',
      ip: '192.168.0.2',
    },
  });

  // Create Website — ✅ Use correct userId
  const website1 = await prismaClient.website.create({
    data: {
      url: 'https://ayush.com',
      userId: user.id, // ✅ This is now valid
    },
  });

  // Create WebsiteTicks
  await prismaClient.websiteTick.createMany({
    data: [
      {
        websiteId: website1.id,
        validatorId: validator1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        status: 'Good',
        latency: 200,
      },
      {
        websiteId: website1.id,
        validatorId: validator2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        status: 'Bad',
        latency: 100,
      },
      {
        websiteId: website1.id,
        validatorId: validator1.id,
        createdAt: new Date(),
        status: 'Good',
        latency: 0,
      },
    ],
  });

  console.log('✅ Seeded successfully!');
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
});
