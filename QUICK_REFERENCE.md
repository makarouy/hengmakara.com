# Quick Reference Card

## ADMIN PANEL CREDENTIALS

```
🔐 ADMIN (Full Access)
Username: admin
Password: admin123
Permissions: Create, Read, Update, Delete, Archive, Duplicate

👤 EXPERT (Limited Access)  
Username: expert
Password: expert123
Permissions: Create, Read, Update, Archive (NO Delete/Duplicate)
```

## MAIN URLS

```
🔗 Admin Login:        http://localhost:3000/admin
🔗 Admin Dashboard:    http://localhost:3000/admin/dashboard
🔗 Projects Page:      http://localhost:3000/works
🔗 Project Detail:     http://localhost:3000/works/[slug]
🔗 Homepage:           http://localhost:3000
```

## QUICK ACTIONS

### Create Project
1. Dashboard → "+ Add New Project"
2. Fill title, slug, category, description
3. Add thumbnail image & gallery images
4. Add tags (optional)
5. Click "Add Project"
→ **Live immediately on /works**

### Edit Project
1. Find project in list
2. Click "✎ Edit"
3. Modify fields
4. Click "Update Project"
→ **Updates instantly**

### Duplicate Project (Admin only)
1. Click "⬍ Copy"
2. Confirm
3. Edit the "(Copy)" version
→ **Independent copy created**

### Archive Project
1. Click "◻ Archive"
2. Confirm
→ **Hidden from frontend, can restore**

### Restore Project
1. Click "↺ Restore"
2. Confirm
→ **Back to Active, visible on frontend**

### Delete Project (Admin only)
1. Click "🗑 Delete"
2. Confirm warning
→ **Permanently removed**

### Create Category
1. In project form, click "+ New"
2. Enter category name
3. Click "Create"
→ **Available immediately**

### Add Tags
1. Type tag in "Tags" field
2. Press Enter
3. Repeat for more tags
4. Click ✕ to remove
→ **Saved with project**

## BUTTONS LEGEND

```
✎ EDIT (Blue)          - Modify project
⬍ COPY (Purple)        - Duplicate (Admin only)
◻ ARCHIVE (Orange)     - Hide project
↺ RESTORE (Green)      - Show archived project
🗑 DELETE (Red)         - Remove permanently (Admin only)
```

## DATABASE FILES

```
data/admin.json              - Admin users & roles
data/projects.json          - All projects
data/featured-content.json  - Featured content
```

## KEY FEATURES

✅ **Edit** - Modify any project
✅ **Delete** - Remove projects (Admin only)
✅ **Duplicate** - Clone projects (Admin only)
✅ **Archive** - Hide temporarily
✅ **Restore** - Reactivate
✅ **Categories** - Create custom categories
✅ **Tags** - Add keywords
✅ **Gallery** - Multiple images per project
✅ **Permissions** - Role-based access
✅ **Real-time** - Frontend updates instantly

## PERMISSION CHECK

| Feature | Admin | Expert |
|---------|-------|--------|
| Create  | ✅    | ✅     |
| Read    | ✅    | ✅     |
| Update  | ✅    | ✅     |
| Delete  | ✅    | ❌     |
| Archive | ✅    | ✅     |
| Duplicate | ✅  | ❌     |

## STATUS ICONS

```
★ FEATURED          - Marked as featured
✓ ACTIVE            - Visible on frontend
⏪ ARCHIVED          - Hidden from frontend
```

## TROUBLESHOOTING

**Projects not appearing on /works?**
→ Check if Active (not Archived)
→ Refresh page to reload

**Cannot delete project?**
→ Must be logged in as Admin
→ Check permissions

**Changes not saving?**
→ Check browser console for errors
→ Verify all required fields filled

**404 on project detail?**
→ Check project slug is unique
→ Verify project is Active

## DOCUMENTATION

📖 **ADMIN_GUIDE.md** - Complete feature guide
📖 **API_REFERENCE.md** - API endpoints
📖 **TESTING_CHECKLIST.md** - Test cases
📖 **IMPLEMENTATION_SUMMARY.md** - Overview

## SHORTCUTS

```
Admin Dashboard:  /admin/dashboard
Create Project:   /admin/dashboard → + Add New Project
All Projects:     /works
Project Detail:   /works/[project-slug]
Homepage:         /
```

## ROLES

👑 **ADMIN**
- Full system access
- Can delete projects
- Can duplicate projects
- Can manage all users

👤 **EXPERT**  
- Create/edit projects
- Can archive projects
- Cannot delete
- Cannot duplicate

## QUICK TEST

1. Login with `admin`/`admin123`
2. Create test project
3. Check `/works` - should appear
4. Edit project
5. Check frontend - updated
6. Duplicate it
7. Archive original
8. Restore it
9. Delete the copy
10. Done! ✅

---

**All Features Working ✅**
**Ready to Use 🚀**
