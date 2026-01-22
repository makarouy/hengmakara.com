## Admin Panel - Complete Feature Guide

### ✅ ALL FUNCTIONS NOW WORKING

---

## LOGIN CREDENTIALS

### Admin Account (Full Permissions)
- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Create, Read, Update, Delete, Archive, Duplicate

### Expert Account (Limited Permissions)
- **Username:** `expert`
- **Password:** `expert123`
- **Permissions:** Create, Read, Update, Archive (NO Delete/Duplicate)

---

## PROJECT MANAGEMENT FEATURES

### 1. CREATE PROJECT ✅
- Click **"+ Add New Project"**
- Fill in all project details:
  - Project Title
  - Slug (URL-friendly name)
  - Category (predefined or create new)
  - Year, Client, Role, Services
  - Excerpt (short description)
  - Full Description
  - Thumbnail Image URL
  - Gallery Images (one URL per line)
  - Tags (keywords for organization)
  - Featured (checkbox to mark as featured)
- Click **"Add Project"**
- Project appears immediately on `/works` and homepage

### 2. EDIT PROJECT ✅
- Click **"✎ Edit"** button on any project
- Form populates with existing data
- Modify any fields
- Click **"Update Project"**
- Changes apply immediately
- Portfolio updates in real-time

### 3. DELETE PROJECT ✅
- Click **"🗑 Delete"** button
- Confirmation: "⚠️ This will permanently delete the project. Are you sure?"
- Admin only - Expert cannot delete
- Project removed from database and frontend
- ID not reused (maintains data integrity)

### 4. DUPLICATE PROJECT ✅ (Admin Only)
- Click **"⬍ Copy"** button
- System creates exact copy with:
  - New auto-generated ID
  - Title suffixed with "(Copy)"
  - New unique slug
  - Same category, gallery, tags, etc.
  - Reset to Active status
  - Not featured by default
- New project appears in list immediately
- Perfect for creating similar projects quickly

### 5. ARCHIVE PROJECT ✅
- Click **"◻ Archive"** to archive
- Project becomes inactive (grayed out in list)
- Shows "Archived" status badge
- Hidden from frontend (not displayed on /works or homepage)
- Click **"↺ Restore"** to reactivate
- Expert and Admin can archive

### 6. PROJECT STATUS TRACKING ✅
- **Active:** Project visible on frontend
- **Archived:** Project hidden from frontend
- Status shown in "Status" column
- Visual indicator: archived rows appear dimmed
- Can toggle between states without losing data

---

## CATEGORY MANAGEMENT

### Static Categories
- Digital Marketing
- Account Recovery
- Media Production

### Dynamic Categories ✅
- Click **"+ New"** next to category dropdown
- Enter new category name
- Click **"Create"**
- Category immediately available in dropdown
- Can be selected for current or future projects
- Used for filtering on frontend

---

## TAGS SYSTEM ✅

### Add Tags
- In "Tags / Keywords" section
- Type tag name (e.g., "facebook", "recovery", "video")
- Press **Enter** or click **"+ Add Tag"**
- Tag appears as colored badge
- Multiple tags per project supported

### Remove Tags
- Click **"✕"** on any tag badge
- Tag removed immediately
- Form auto-saves tag list

### Uses
- Better content organization
- Future search/filter capability
- SEO improvements
- Content categorization

---

## FEATURED CONTENT MANAGEMENT

### Create Featured Content
- Switch to **"Featured Content"** tab
- Click **"+ Add Featured Content"**
- Add images, videos, or text
- Mark as featured to highlight on homepage

### Manage Featured Content
- Edit, delete, and archive featured content
- Same workflow as projects
- Stored separately in database
- Displays in designated homepage section

---

## ROLE-BASED PERMISSIONS

### ADMIN Permissions
✅ Create projects
✅ Read/View all projects
✅ Edit any project
✅ Delete projects (permanent)
✅ Duplicate projects
✅ Archive/Restore projects
✅ Create categories
✅ Access all features

### EXPERT Permissions
✅ Create projects
✅ Read/View all projects
✅ Edit their projects
✅ Archive/Restore projects
✅ Create categories
❌ Delete projects
❌ Duplicate projects
❌ Cannot delete archived content

### Permission Enforcement
- Checked on login (role/permissions stored in localStorage)
- Checked on API calls (backend validation)
- UI buttons disabled/hidden based on role
- Permission warnings shown when attempting restricted action

---

## DATA MANAGEMENT

### Projects Database (`data/projects.json`)
- Stores all project data
- Auto-generated IDs
- Fields: id, title, slug, category, year, client, role, services, excerpt, description, src, gallery[], tags[], featured, archived, createdAt, updatedAt
- Accessible via `/api/projects`

### Admin Users Database (`data/admin.json`)
- Multiple user accounts with roles
- Each user: id, username, password, email, role, permissions[]
- Supports future expansion to more users

### API Endpoints
- `GET /api/projects` - Fetch all projects
- `GET /api/projects/[id]` - Fetch single project
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/duplicate` - Duplicate project
- `PATCH /api/projects/[id]/archive` - Archive/Unarchive project
- `POST /api/auth/login` - User authentication

---

## WORKFLOWS

### Complete Project Upload
1. Login with admin/expert credentials
2. Click "+ Add New Project"
3. Fill title, slug, category
4. Add year, client, role
5. Write excerpt and description
6. Add thumbnail image URL
7. Paste gallery image URLs (one per line)
8. Add relevant tags
9. Mark as featured if needed
10. Click "Add Project"
11. ✅ Project live on /works and homepage

### Edit & Update
1. Find project in list
2. Click "✎ Edit"
3. Modify fields
4. Click "Update Project"
5. ✅ Frontend updates instantly

### Hide Temporarily
1. Find project in list
2. Click "◻ Archive"
3. Project grayed out, marked "Archived"
4. ✅ Hidden from frontend

### Restore Archived
1. Find archived project (appears dimmed)
2. Click "↺ Restore"
3. ✅ Project returns to Active status

### Duplicate & Modify
1. Find project to duplicate
2. Click "⬍ Copy"
3. New project "(Copy)" created
4. Edit the copy for new project
5. ✅ Keep original, create variation

### Permanent Delete
1. Find project to remove
2. Click "🗑 Delete"
3. Confirm warning
4. ✅ Project permanently removed

---

## TROUBLESHOOTING

### Permission Denied
- Verify login role (admin vs expert)
- Some features exclusive to admin
- Logout and login with correct role

### Changes Not Showing
- Refresh page to see updates
- Check network tab if errors occur
- Verify project is "Active" (not archived)

### 404 on Project Detail
- Ensure slug is URL-friendly (no spaces/special chars)
- Slug must be unique
- Check project is not archived

### File Upload Issues
- Ensure image URLs are valid
- Test URLs in browser first
- Check image permissions/access
- Consider using absolute URLs

---

## DATABASE STRUCTURE

### Project Object
```json
{
  "id": 1,
  "title": "Project Name",
  "slug": "project-slug",
  "category": "Digital Marketing",
  "year": "2026",
  "client": "Client Name",
  "role": "Position",
  "services": "Service Type",
  "excerpt": "Short description",
  "description": "Full description",
  "src": "/images/projects/thumbnail.jpg",
  "gallery": ["/images/projects/img1.jpg", "/images/projects/img2.jpg"],
  "tags": ["tag1", "tag2"],
  "featured": true,
  "archived": false,
  "createdAt": "2026-01-21",
  "updatedAt": "2026-01-21"
}
```

---

## SECURITY NOTES

⚠️ **IMPORTANT FOR PRODUCTION:**
- Change demo passwords immediately
- Use stronger password policies
- Implement JWT tokens (currently using base64)
- Add rate limiting on login
- Implement HTTPS
- Add audit logging
- Backup database regularly

---

## NEXT FEATURES (Optional)

- [ ] Bulk actions (delete/archive multiple)
- [ ] Search functionality
- [ ] Advanced filters
- [ ] Image upload instead of URL
- [ ] SEO meta tags editor
- [ ] Analytics dashboard
- [ ] User management UI
- [ ] Backup/Restore system
- [ ] Activity logs
- [ ] Two-factor authentication

---

**All features tested and working. Enjoy! 🚀**
