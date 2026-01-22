import { db } from '@/lib/db';

// GET all pricing plans
export async function GET(req) {
  try {
    const pricing = await db.getAll('pricing');
    return Response.json(pricing);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}

// POST new pricing plan
export async function POST(req) {
  try {
    const newPlan = await req.json();
    
    // Input Validation
    if (!newPlan.title || !newPlan.price) {
        return Response.json({ error: 'Title and Price are required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const plan = {
      ...newPlan,
      id,
      createdAt: new Date().toISOString()
    };
    
    await db.create('pricing', plan);
    
    return Response.json(plan, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create pricing plan', error);
    return Response.json({ error: 'Failed to create pricing plan' }, { status: 500 });
  }
}
