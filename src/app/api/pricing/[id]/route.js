import { db } from '@/lib/db';

// GET single pricing plan
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const plan = await db.getById('pricing', id);
    
    if (!plan) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(plan);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch pricing plan' }, { status: 500 });
  }
}

// PUT update pricing plan
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();
    const plan = await db.update('pricing', id, updates);
    
    if (!plan) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(plan);
  } catch (error) {
    return Response.json({ error: 'Failed to update pricing plan' }, { status: 500 });
  }
}

// DELETE pricing plan
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const success = await db.delete('pricing', id);

    if (!success) {
        return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete pricing plan' }, { status: 500 });
  }
}
