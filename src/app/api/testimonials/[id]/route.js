import { db } from '@/lib/db';

// GET single testimonial
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const testimonial = await db.getById('testimonials', id);
    
    if (!testimonial) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(testimonial);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT update testimonial
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();
    const testimonial = await db.update('testimonials', id, updates);
    
    if (!testimonial) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    
    return Response.json(testimonial);
  } catch (error) {
    return Response.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const success = await db.delete('testimonials', id);

    if (!success) {
        return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
