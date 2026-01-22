import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-change-in-production-please'
);

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await db.getAdminUser(username);
    
    if (!user) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (supports both hash and plaintext for migration)
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false) || user.password === password;

    if (!isMatch) {
        return Response.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
    }
    
    // Create a secure JWT
    const token = await new SignJWT({ 
        username: user.username, 
        role: user.role || 'admin' 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return Response.json({
      success: true,
      token,
      username: user.username,
      email: user.email,
      role: user.role || 'admin',
      permissions: user.permissions || ['create', 'read', 'update', 'delete']
    });
  } catch (error) {
    console.error('Login Error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}

