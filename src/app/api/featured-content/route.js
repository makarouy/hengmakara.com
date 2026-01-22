import { db } from '@/lib/db';

// GET all featured content
export async function GET(req) {
  try {
    const content = await db.getAll('featuredContent');
    return Response.json(content);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST new featured content
export async function POST(req) {
  try {
    const newContent = await req.json();

    // Input Validation
    if (!newContent.title || !newContent.type) {
      return Response.json({ error: 'Title and Type are required' }, { status: 400 });
    }

    const contents = await db.getAll('featuredContent');
    
    // Robust ID generation
    const existingIds = contents.map(c => Number(c.id)).filter(n => !isNaN(n));
    const id = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Robust Order generation
    const existingOrders = contents.map(c => Number(c.order)).filter(n => !isNaN(n));
    const maxOrder = existingOrders.length > 0 ? Math.max(...existingOrders) : 0;
    
    const content = {
      ...newContent,
      id,
      order: maxOrder + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    await db.create('featuredContent', content);
    
    return Response.json(content, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create content', error);
    return Response.json({ error: 'Failed to create content' }, { status: 500 });
  }
}
