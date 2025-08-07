import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing database connection...');
    
    // Test connection by querying the database
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful! Result:', result);
    
    // Check if ChapterResource table exists
    try {
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'ChapterResource'
        ) as "exists"
      `;
      console.log('ChapterResource table exists:', tableExists);
    } catch (error) {
      console.error('Error checking for ChapterResource table:', error);
    }
    
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
