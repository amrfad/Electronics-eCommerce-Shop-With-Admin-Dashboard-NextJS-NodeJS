const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for feedback testing...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123456", 14);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@singitronic.com" },
    update: {},
    create: {
      id: nanoid(),
      email: "admin@singitronic.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Create test user
  const testUserPassword = await bcrypt.hash("testuser123", 14);

  const testUser = await prisma.user.upsert({
    where: { email: "testuser@example.com" },
    update: {},
    create: {
      id: nanoid(),
      email: "testuser@example.com",
      password: testUserPassword,
      role: "user",
    },
  });

  console.log("👤 Created users:", {
    admin: adminUser.email,
    testUser: testUser.email,
  });

  // Create sample categories
  const category = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      id: nanoid(),
      name: "Electronics",
    },
  });

  // Create sample products
  const products = [
    {
      id: nanoid(),
      slug: "sample-laptop",
      title: "Sample Laptop",
      mainImage: "laptop.jpg",
      price: 999,
      rating: 4,
      description: "A high-performance laptop for work and gaming.",
      manufacturer: "TechCorp",
      inStock: 10,
      categoryId: category.id,
    },
    {
      id: nanoid(),
      slug: "sample-headphones",
      title: "Sample Headphones",
      mainImage: "headphones.jpg",
      price: 199,
      rating: 5,
      description: "Premium quality headphones with noise cancellation.",
      manufacturer: "AudioTech",
      inStock: 25,
      categoryId: category.id,
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    createdProducts.push(createdProduct);
  }

  console.log(
    "📦 Created products:",
    createdProducts.map((p) => p.title)
  );

  // Create sample feedback
  const feedbacks = [
    {
      id: nanoid(),
      productId: createdProducts[0].id,
      userId: testUser.id,
      comment:
        "Excellent laptop! Very fast and reliable. Highly recommend for developers.",
      rating: 5,
    },
    {
      id: nanoid(),
      productId: createdProducts[1].id,
      userId: testUser.id,
      comment: "Amazing sound quality! The noise cancellation works perfectly.",
      rating: 5,
    },
    {
      id: nanoid(),
      productId: createdProducts[0].id,
      userId: adminUser.id,
      comment:
        "Good build quality but a bit heavy. Overall satisfied with the performance.",
      rating: 4,
    },
  ];

  for (const feedback of feedbacks) {
    await prisma.feedback.upsert({
      where: {
        productId_userId: {
          productId: feedback.productId,
          userId: feedback.userId,
        },
      },
      update: {},
      create: feedback,
    });
  }

  console.log("💬 Created feedback entries:", feedbacks.length);

  console.log("✅ Seeding completed!");
  console.log("\n🔐 Test Credentials:");
  console.log("Admin: admin@singitronic.com / admin123456");
  console.log("User: testuser@example.com / testuser123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
