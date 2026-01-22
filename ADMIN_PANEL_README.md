# Admin Panel Setup & Usage

## 🎯 Overview
Your admin panel is now ready! You can manage all your projects and works through an easy-to-use dashboard.

## 📍 Access Points

- **Login Page**: `http://localhost:3000/admin`
- **Dashboard**: `http://localhost:3000/admin/dashboard`

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

> ⚠️ **Important**: Change these credentials in `data/admin.json` after first login!

## ✨ Features

### 1. **Project Management**
   - ✅ Create new projects/works
   - ✅ Edit existing projects
   - ✅ Delete projects
   - ✅ Mark projects as featured
   - ✅ Manage categories (Digital Marketing, Account Recovery, Media Production)

### 2. **Project Fields**
   - **Title**: Project name
   - **Slug**: URL-friendly identifier
   - **Category**: Type of work
   - **Excerpt**: Short description
   - **Description**: Detailed description
   - **Image URL**: Path to project image
   - **Year**: Project year
   - **Client**: Client name
   - **Services**: Services provided
   - **Featured**: Mark as featured project

### 3. **Auto-Integration**
   The admin panel automatically syncs with your frontend:
   - New projects appear in `/works` page
   - Featured projects show up in portfolio section
   - All data is stored in `data/projects.json`

## 📁 File Structure

```
data/
├── projects.json          # All your projects data
└── admin.json            # Admin credentials

src/
├── app/
│   ├── admin/
│   │   ├── page.js       # Login page
│   │   └── dashboard/
│   │       └── page.js   # Admin dashboard
│   └── api/
│       ├── projects/
│       │   ├── route.js  # Get/Create projects
│       │   └── [id]/route.js # Get/Update/Delete specific project
│       └── auth/
│           └── login/route.js # Login endpoint
├── components/admin/
│   ├── AddProjectForm.jsx     # Create/Edit form
│   └── ProjectsList.jsx       # Projects table
└── assets/css/
    └── admin.css         # Admin panel styles
```

## 🚀 How to Use

### 1. **Login**
```
1. Go to http://localhost:3000/admin
2. Enter username: admin
3. Enter password: admin123
4. Click Login
```

### 2. **Add a New Project**
```
1. Click "+ Add New Project" button
2. Fill in all required fields (marked with *)
3. Click "Add Project"
4. Check /works page to see it live
```

### 3. **Edit a Project**
```
1. Click "Edit" button next to the project
2. Update the fields
3. Click "Update Project"
```

### 4. **Delete a Project**
```
1. Click "Delete" button
2. Confirm deletion
3. Project is removed from database
```

## 🔧 API Endpoints

All data is managed through these REST endpoints:

```
GET    /api/projects              # Get all projects
POST   /api/projects              # Create new project
GET    /api/projects/[id]         # Get single project
PUT    /api/projects/[id]         # Update project
DELETE /api/projects/[id]         # Delete project
POST   /api/auth/login            # Login
```

## 💾 Data Storage

All projects are stored in `data/projects.json`:

```json
[
  {
    "id": 1,
    "title": "Project Name",
    "slug": "project-slug",
    "category": "Digital Marketing",
    "excerpt": "Short description",
    "description": "Full description",
    "src": "/images/projects/project.jpg",
    "year": "2026",
    "client": "Client Name",
    "services": "Service Type",
    "featured": true,
    "createdAt": "2026-01-21"
  }
]
```

## 🎨 Customization

### Change Admin Credentials
Edit `data/admin.json`:
```json
{
  "username": "your-username",
  "password": "your-password",
  "email": "your-email@example.com"
}
```

### Add New Categories
Edit the category dropdown in `src/components/admin/AddProjectForm.jsx`:
```jsx
<select id="category" name="category" required>
  <option value="Your Category">Your Category</option>
</select>
```

## 🔒 Security Tips

1. **Change default password immediately**
2. **Use strong passwords** (mix of letters, numbers, symbols)
3. **Backup `data/projects.json`** regularly
4. **Never share credentials** in public repositories

## 🐛 Troubleshooting

### Projects not saving?
- Check if `data/` folder exists
- Ensure `data/projects.json` has correct JSON format
- Check browser console for errors

### Login not working?
- Verify credentials in `data/admin.json`
- Clear browser cache/cookies
- Try in incognito mode

### Images not showing?
- Ensure image path is correct (e.g., `/images/projects/work1.jpg`)
- Check if image file exists in public folder

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- ✅ Desktop
- ✅ Tablet  
- ✅ Mobile devices

## 🔄 Frontend Integration

Your projects automatically sync with:
- **Works Page** (`/works`) - Shows all projects
- **Portfolio Section** - Shows featured projects
- **Services Page** - Project categories

## 📊 Next Steps

1. Test the admin panel
2. Add your projects
3. Change admin credentials
4. Update project images paths
5. Customize categories as needed

---

**Need help?** Check the browser console for error messages or verify file structure.
