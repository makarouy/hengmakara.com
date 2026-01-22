import { db } from '@/lib/db';

// GET single featured content
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const content = await db.getById('featuredContent', id);
    
    if (!content) {
      return Response.json({ error: 'Content not found' }, { status: 404 });
    }
    
    return Response.json(content);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT update featured content
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updatedData = await req.json();
    const content = await db.update('featuredContent', id, updatedData);
    
    if (!content) {
      return Response.json({ error: 'Content not found' }, { status: 404 });
    }
    
    return Response.json(content);
  } catch (error) {
    return Response.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

// DELETE featured content
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const success = await db.delete('featuredContent', id);
    
    if (!success) {
         return Response.json({ error: 'Content not found' }, { status: 404 });
    }

    return Response.json({ message: 'Content deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
