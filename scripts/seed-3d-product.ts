const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.findFirst({ where: { slug: "phone-cases" } });
  if (!cat) {
    console.log("ERROR: phone-cases category not found");
    return;
  }

  const p = await prisma.product.upsert({
    where: { slug: "auracase-cosmic-orange-iphone-17-pro" },
    update: {},
    create: {
      name: "AuraCase Cosmic Orange — iPhone 17 Pro",
      slug: "auracase-cosmic-orange-iphone-17-pro",
      description: "Premium case for iPhone 17 Pro. View it in interactive 3D.",
      price: 39.99,
      oldPrice: 49.99,
      discount: 20,
      image: "/products/phone-cases/case-1.jpg",
      images: "/products/phone-cases/case-1.jpg",
      categoryId: cat.id,
      colors: "Cosmic Orange, Midnight, Clear, Ocean, Violet",
      sizes: "iPhone 17 Pro",
      rating: 4.9,
      reviews: 87,
      inStock: true,
      stock: 120,
      lowStockThreshold: 15,
      featured: true,
      specifications: {
        material: "Polycarbonate + Soft-Touch Matte",
        protection: "MagSafe Compatible, MIL-STD 810H",
        features: ["3D Preview", "MagSafe Charging", "Raised Camera Lip", "Anti-Slip Grip"],
        viewer3d: true,
        phoneColor: "#2c2c2e",
        caseColor: "#e05c00",
      },
    },
  });
  console.log("Created product:", p.slug, p.id);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
