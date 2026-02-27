require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const relations = await prisma.$queryRaw`
    SELECT
      tc.table_name AS table_name,
      kcu.column_name AS column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.column_name;
  `;
  
  console.log('\n📊 DATABASE TABLE RELATIONSHIPS:\n');
  console.log('Table'.padEnd(20) + 'Column'.padEnd(20) + 'References'.padEnd(20) + 'Column');
  console.log('─'.repeat(80));
  
  relations.forEach(r => {
    console.log(
      r.table_name.padEnd(20) + 
      r.column_name.padEnd(20) + 
      r.foreign_table.padEnd(20) + 
      r.foreign_column
    );
  });
  
  console.log('\n✅ Total relationships:', relations.length);
})()
.catch(e => { console.error('❌ Error:', e.message); process.exit(1); })
.finally(() => prisma.$disconnect());
