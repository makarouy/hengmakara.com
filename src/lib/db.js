import { promises as fs } from 'fs';
import { join } from 'path';

// Cache for in-memory storage
let memoryStore = {
  projects: null,
  services: null,
  testimonials: null,
  pricing: null,
  settings: null,
  featuredContent: null,
  feedback: null,
  admin: null, // For auth
  messages: null
};

const DATA_DIR = join(process.cwd(), 'data');

const FILES = {
  projects: 'projects.json',
  services: 'services.json',
  testimonials: 'testimonials.json',
  pricing: 'pricing.json',
  settings: 'settings.json',
  featuredContent: 'featured-content.json',
  feedback: 'feedback.json',
  admin: 'admin.json',
  messages: 'messages.json'
};

// Helper: Read file initially (Seed Data)
async function loadData(key) {
  if (memoryStore[key]) return memoryStore[key];

  try {
    const filePath = join(DATA_DIR, FILES[key]);
    const fileContent = await fs.readFile(filePath, 'utf8');
    memoryStore[key] = JSON.parse(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
        const defaults = getDefaults(key);
        memoryStore[key] = defaults;
    } else {
        console.error(`DB Error: Failed to load ${key}`, error);
        memoryStore[key] = getDefaults(key);
    }
  }
  return memoryStore[key];
}

function getDefaults(key) {
    switch (key) {
        case 'feedback': return { comments: [], ratings: [], reactions: [], views: [] };
        case 'settings': return { siteName: 'Site Name' }; 
        case 'admin': return { users: [] };
        default: return [];
    }
}

// Helper: Persist to disk (Only in Dev/VPS, skipped on Vercel)
async function persist(key) {
  // Check environment variables to determine if we should write to disk
  // Vercel (Production) usually doesn't have write access, so we skip unless explicitly enabled.
  const isVercel = process.env.VERCEL === '1';
  const forcePersistence = process.env.ENABLE_PERSISTENCE === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  if (isVercel && !forcePersistence) {
      // In Serverless/Vercel: Data is ephemeral (in-memory only for this Lambda instance)
      // This satisfies the requirement "No filesystem writes on Vercel"
      return;
  }

  // If local dev or VPS with persistence enabled
  if (isDev || forcePersistence) {
      try {
        const filePath = join(DATA_DIR, FILES[key]);
        await fs.writeFile(filePath, JSON.stringify(memoryStore[key], null, 2));
      } catch (error) {
        console.error(`DB Error: Failed to save ${key}`, error);
      }
  }
}

export const db = {
  async getAll(collection) {
    return loadData(collection);
  },

  async getById(collection, id) {
    const data = await loadData(collection);
    // Handle both string and number IDs
    return data.find(item => item.id == id);
  },

  async create(collection, item) {
    const data = await loadData(collection);
    data.push(item);
    memoryStore[collection] = data;
    await persist(collection);
    return item;
  },

  async update(collection, id, updates) {
    const data = await loadData(collection);
    const index = data.findIndex(item => item.id == id);
    if (index === -1) return null;
    
    // Merge updates
    data[index] = { ...data[index], ...updates };
    // Ensure ID isn't lost or mutated if not provided
    data[index].id = id; 
    
    memoryStore[collection] = data;
    await persist(collection);
    return data[index];
  },

  async delete(collection, id) {
    let data = await loadData(collection);
    const initialLength = data.length;
    data = data.filter(item => item.id != id);
    
    if (data.length === initialLength) return false;

    memoryStore[collection] = data;
    await persist(collection);
    return true;
  },

  // Special handler for non-array settings and admin
  async getSettings() {
      return loadData('settings');
  },
  
  async updateSettings(updates) {
      let current = await loadData('settings');
      current = { ...current, ...updates };
      memoryStore['settings'] = current;
      await persist('settings');
      return current;
  },

  async getAdminUser(username) {
      const adminData = await loadData('admin');
      const users = adminData.users || [adminData];
      return users.find(u => u.username === username);
  },

  // Special handler for Feedback (complex object)
  async getFeedback() {
      return loadData('feedback');
  },
  
  async updateFeedback(newData) {
      memoryStore['feedback'] = newData;
      await persist('feedback');
      return newData;
  }
};
