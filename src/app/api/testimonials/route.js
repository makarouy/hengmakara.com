import { db } from '@/lib/db';

// GET all testimonials
export async function GET(req) {
  try {
    const testimonials = await db.getAll('testimonials');
    return Response.json(testimonials);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}

// POST new testimonial
export async function POST(req) {
  try {
    const newTestimonial = await req.json();
    
    // Input Validation
    if (!newTestimonial.name || !newTestimonial.text) {
        return Response.json({ error: 'Name and Text are required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const testimonial = {
      ...newTestimonial,
      id,
      createdAt: new Date().toISOString()
    };
    
    await db.create('testimonials', testimonial);

    return Response.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return Response.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
