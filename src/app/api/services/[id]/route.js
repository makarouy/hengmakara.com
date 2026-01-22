import { db } from '@/lib/db';

// GET single service
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const service = await db.getById('services', id);
    
    if (!service) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(service);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT update service
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();
    const service = await db.update('services', id, updates);
    
    if (!service) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(service);
  } catch (error) {
    return Response.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const success = await db.delete('services', id);

    if (!success) {
        return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
