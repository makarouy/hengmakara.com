import { db } from '@/lib/db';

// GET all services
export async function GET(req) {
  try {
    const services = await db.getAll('services');
    return Response.json(services);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}

// POST new service
export async function POST(req) {
  try {
    const newService = await req.json();

    if (!newService.title || !newService.description) {
        return Response.json({ error: 'Title and Description are required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const service = {
      ...newService,
      id,
      createdAt: new Date().toISOString()
    };

    await db.create('services', service);

    return Response.json(service, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create service', error);
    return Response.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
