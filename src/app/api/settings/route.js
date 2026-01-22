import { db } from '@/lib/db';

// GET all settings
export async function GET(req) {
  try {
    const settings = await db.getSettings();
    return Response.json(settings);
  } catch (error) {
    return Response.json({
      siteName: 'Heng Makara',
      siteDescription: 'Professional Portfolio & Services'
    }, { status: 200 });
  }
}

// PUT update settings
export async function PUT(req) {
  try {
    const updates = await req.json();
    const updated = await db.updateSettings(updates);
    return Response.json(updated);
  } catch (error) {
    console.error('API Error: Failed to update settings', error);
    return Response.json({ error: 'Failed to update settings', details: error.message }, { status: 500 });
  }
}
