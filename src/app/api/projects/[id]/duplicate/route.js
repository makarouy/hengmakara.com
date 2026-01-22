import { promises as fs } from 'fs';
import { join } from 'path';

const dataFile = join(process.cwd(), 'data', 'projects.json');

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const data = await fs.readFile(dataFile, 'utf8');
    let projects = JSON.parse(data);
    
    const project = projects.find(p => p.id === parseInt(id));
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create duplicate with new ID
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const duplicated = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      featured: false
    };

    projects.push(duplicated);
    await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));

    return Response.json(duplicated);
  } catch (error) {
    return Response.json({ error: 'Failed to duplicate project' }, { status: 500 });
  }
}
