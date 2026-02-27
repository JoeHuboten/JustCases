const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewDatabase() {
  console.log('🔍 JustCases Database Contents\n');
  
  try {
    // Categories
    const categories = await prisma.category.findMany();
    console.log('📂 CATEGORIES:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    console.log(`  Total: ${categories.length} categories\n`);
    
    // Products
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    console.log('📱 PRODUCTS:');
    products.forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) - ${product.category.name}`);
    });
    console.log(`  Total: ${products.length} products\n`);
    
    // Users
    const users = await prisma.user.findMany();
    console.log('👤 USERS:');
    users.forEach(user => {
      console.log(`  - ${user.name || 'No name'} (${user.email || 'No email'})`);
    });
    console.log(`  Total: ${users.length} users\n`);
    
    // Orders
    const orders = await prisma.order.findMany();
    console.log('🛒 ORDERS:');
    orders.forEach(order => {
      console.log(`  - Order #${order.id} - $${order.total} (${order.status})`);
    });
    console.log(`  Total: ${orders.length} orders\n`);
    
  } catch (error) {
    console.error('❌ Error viewing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewDatabase();
