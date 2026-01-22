import { promises as fs } from 'fs';
import { join } from 'path';

const dataFile = join(process.cwd(), 'data', 'projects.json');

// PATCH archive/unarchive project
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { archived } = await req.json();
    const data = await fs.readFile(dataFile, 'utf8');
    let projects = JSON.parse(data);
    
    const index = projects.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[index].archived = archived;
    projects[index].updatedAt = new Date().toISOString().split('T')[0];
    
    await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));

    return Response.json(projects[index]);
  } catch (error) {
    return Response.json({ error: 'Failed to update archive status' }, { status: 500 });
  }
}
