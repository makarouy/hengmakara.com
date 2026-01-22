import { db } from '@/lib/db';

// GET single project
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const project = await db.getById('projects', id);
    
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return Response.json(project);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updatedData = await req.json();
    const project = await db.update('projects', id, updatedData);
    
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return Response.json(project);
  } catch (error) {
    return Response.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const success = await db.delete('projects', id);

    if (!success) {
         return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ message: 'Project deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
