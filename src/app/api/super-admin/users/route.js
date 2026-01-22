import { db } from '@/lib/db';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const ADMIN_DATA_PATH = join(DATA_DIR, 'admin.json');

// Helper to verify master access
async function verifyMaster(req) {
  // Check headers or body for master auth
  // For GET requests, we check headers. for POST/DELETE we might check body.
  const authHeader = req.headers.get('x-master-key');
  const authUser = req.headers.get('x-master-user') || 'admin@hengmakara.com';
  
  const adminUser = await db.getAdminUser(authUser);
  
  if (!adminUser || adminUser.password !== authHeader) {
    return false;
  }
  return true;
}

async function getAdminData() {
  const fileContent = await fs.readFile(ADMIN_DATA_PATH, 'utf8');
  return JSON.parse(fileContent);
}

async function saveAdminData(data) {
  await fs.writeFile(ADMIN_DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req) {
  if (!await verifyMaster(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getAdminData();
    // Return users without passwords
    const safeUsers = data.users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      permissions: u.permissions
    }));
    return Response.json({ users: safeUsers });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!await verifyMaster(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { username, password, email, role, permissions, action } = body;
    const data = await getAdminData();

    if (action === 'delete') {
      const initialLength = data.users.length;
      data.users = data.users.filter(u => u.username !== username);
      if (data.users.length === initialLength) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
      await saveAdminData(data);
      return Response.json({ success: true, message: 'User deleted' });
    }

    // Create or Update
    const existingIndex = data.users.findIndex(u => u.username === username);

    const newUser = {
      username,
      email: email || username,
      role: role || 'admin',
      permissions: permissions || ["read"],
      // Use existing ID if updating, else new timestamp
      id: existingIndex >= 0 ? data.users[existingIndex].id : Date.now()
    };
    
    // Only update password if provided
    if (password) {
      newUser.password = password;
    } else if (existingIndex >= 0) {
      // Keep old password
      newUser.password = data.users[existingIndex].password;
    } else {
      return Response.json({ error: 'Password required for new user' }, { status: 400 });
    }

    if (existingIndex >= 0) {
      // Update
      // Preserve other fields if any
      data.users[existingIndex] = { ...data.users[existingIndex], ...newUser };
    } else {
      // Create
      data.users.push(newUser);
    }

    await saveAdminData(data);
    return Response.json({ success: true, message: existingIndex >= 0 ? 'User updated' : 'User created' });

  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Operation failed' }, { status: 500 });
  }
}
