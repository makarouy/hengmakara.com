import { db } from '@/lib/db';

// GET all projects
export async function GET(req) {
  try {
    const projects = await db.getAll('projects');
    return Response.json(projects);
  } catch (error) {
    return Response.json([], { status: 200 });
  }
}

// POST new project
export async function POST(req) {
  try {
    const newProject = await req.json();

    if (!newProject.title || !newProject.category) {
        return Response.json({ error: 'Title and Category are required' }, { status: 400 });
    }

    // Generate ID
    const id = Date.now();
    const project = {
      ...newProject,
      id,
      createdAt: new Date().toISOString()
    };
    
    await db.create('projects', project);

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('API Error: Failed to create project', error);
    return Response.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
