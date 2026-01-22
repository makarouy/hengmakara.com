# Admin Panel - Testing Checklist

## Pre-Testing Setup
- [ ] Dev server running: `npm run dev`
- [ ] Access http://localhost:3000/admin
- [ ] Browser console open (F12)
- [ ] Network tab open to check API calls

---

## AUTHENTICATION TESTS ✅

### Test 1: Admin Login
- [ ] Navigate to http://localhost:3000/admin
- [ ] Enter username: `admin`
- [ ] Enter password: `admin123`
- [ ] Click Login
- [ ] ✓ Redirected to dashboard
- [ ] ✓ See "Welcome back, admin"
- [ ] ✓ All features visible

### Test 2: Expert Login
- [ ] Click Logout
- [ ] Enter username: `expert`
- [ ] Enter password: `expert123`
- [ ] Click Login
- [ ] ✓ Redirected to dashboard
- [ ] ✓ See "Welcome back, expert"
- [ ] ✓ Delete/Duplicate buttons disabled
- [ ] ✓ Edit/Archive buttons enabled

### Test 3: Invalid Credentials
- [ ] Try wrong password
- [ ] ✓ See error message
- [ ] Try non-existent username
- [ ] ✓ See error message

### Test 4: Session Persistence
- [ ] Login as admin
- [ ] Refresh page
- [ ] ✓ Still logged in
- [ ] Clear localStorage
- [ ] Refresh page
- [ ] ✓ Redirected to login

---

## PROJECT CREATION TESTS ✅

### Test 5: Create Basic Project
- [ ] Login as admin
- [ ] Click "+ Add New Project"
- [ ] Fill required fields:
  - [ ] Title: "Test Project"
  - [ ] Slug: "test-project"
  - [ ] Category: "Digital Marketing"
  - [ ] Excerpt: "Test excerpt"
  - [ ] Description: "Test description"
  - [ ] Thumbnail: "/images/projects/work1.jpg"
- [ ] Click "Add Project"
- [ ] ✓ Project appears in list
- [ ] ✓ Success message shown
- [ ] ✓ Form clears

### Test 6: Create Project with Gallery
- [ ] Click "+ Add New Project"
- [ ] Fill basic fields
- [ ] Add thumbnail URL
- [ ] Paste gallery images:
  ```
  /images/projects/media-production/borey-rachana-shortfilm/bts1.jpg
  /images/projects/media-production/borey-rachana-shortfilm/bts2.jpg
  ```
- [ ] Click "+ Add Images to Gallery"
- [ ] ✓ Images appear as grid
- [ ] ✓ Remove buttons appear
- [ ] Click "Add Project"
- [ ] ✓ Gallery saved

### Test 7: Create Project with Tags
- [ ] Click "+ Add New Project"
- [ ] Fill basic fields
- [ ] In Tags field, type: "facebook"
- [ ] Press Enter
- [ ] ✓ Tag appears as badge
- [ ] Type "recovery"
- [ ] Press Enter
- [ ] ✓ Second tag appears
- [ ] Click "Add Project"
- [ ] ✓ Tags saved with project

### Test 8: Create Custom Category
- [ ] Click "+ Add New Project"
- [ ] Click "+ New" next to category
- [ ] Type "Branding"
- [ ] Click "Create"
- [ ] ✓ "Branding" selected in dropdown
- [ ] Fill remaining fields
- [ ] Click "Add Project"
- [ ] ✓ Project created with new category
- [ ] ✓ Category available for future projects

### Test 9: Projects Appear on Frontend
- [ ] Create a project via admin
- [ ] Visit http://localhost:3000/works
- [ ] ✓ New project visible in list
- [ ] Visit http://localhost:3000/
- [ ] ✓ New project visible in Works section
- [ ] Click project card
- [ ] ✓ Redirected to /works/[slug]
- [ ] ✓ Project details displayed
- [ ] ✓ Gallery displays if added

---

## EDIT TESTS ✅

### Test 10: Edit Project Title
- [ ] Find project in admin list
- [ ] Click "✎ Edit"
- [ ] ✓ Form populates with data
- [ ] Change title to "Edited Title"
- [ ] Click "Update Project"
- [ ] ✓ Success message shown
- [ ] ✓ List shows updated title
- [ ] Check frontend
- [ ] ✓ Title updated on /works

### Test 11: Edit Gallery
- [ ] Click "✎ Edit" on project
- [ ] Find gallery section
- [ ] ✓ Current images displayed
- [ ] Click ✕ to remove one image
- [ ] ✓ Image removed from preview
- [ ] Add new image URL
- [ ] Click "+ Add Images to Gallery"
- [ ] ✓ New image added
- [ ] Click "Update Project"
- [ ] Check frontend gallery
- [ ] ✓ Gallery updated

### Test 12: Edit Tags
- [ ] Click "✎ Edit" on project
- [ ] View tags section
- [ ] ✓ Current tags shown as badges
- [ ] Click ✕ on a tag
- [ ] ✓ Tag removed
- [ ] Add new tag
- [ ] Click "Update Project"
- [ ] ✓ Tags updated

---

## DELETE TESTS ✅

### Test 13: Delete Project (Admin)
- [ ] Login as admin
- [ ] Find project to delete
- [ ] Click "🗑 Delete"
- [ ] ✓ Confirmation appears: "⚠️ This will permanently delete..."
- [ ] Click OK
- [ ] ✓ Project removed from list
- [ ] Check frontend
- [ ] ✓ Project no longer visible
- [ ] Check database (optional)
- [ ] ✓ Project removed from /data/projects.json

### Test 14: Delete Permission (Expert)
- [ ] Login as expert
- [ ] Create test project
- [ ] Look for delete button
- [ ] ✓ Delete button MISSING (permission denied)
- [ ] Cannot delete

### Test 15: Undo Prevention
- [ ] Delete a project
- [ ] Refresh page
- [ ] ✓ Deletion is permanent (no undo)
- [ ] (Consider archiving instead for recovery)

---

## DUPLICATE TESTS ✅

### Test 16: Duplicate Project (Admin)
- [ ] Login as admin
- [ ] Find project to duplicate
- [ ] Click "⬍ Copy"
- [ ] ✓ Confirmation: "Duplicate 'Project Name'?"
- [ ] Click OK
- [ ] ✓ New project appears in list
- [ ] ✓ Title shows "(Copy)" suffix
- [ ] ✓ Slug shows "-copy-" with timestamp
- [ ] ✓ Same category/gallery/tags copied
- [ ] ✓ Featured = false
- [ ] ✓ Archived = false

### Test 17: Duplicate Permission (Expert)
- [ ] Login as expert
- [ ] Find project
- [ ] Look for copy button
- [ ] ✓ Copy button MISSING (permission denied)
- [ ] Cannot duplicate

### Test 18: Edit Duplicate
- [ ] Duplicate a project
- [ ] Click "✎ Edit" on duplicate
- [ ] Change title to "Brand New Project"
- [ ] Change slug to "brand-new-project"
- [ ] Update gallery/tags as needed
- [ ] Click "Update Project"
- [ ] ✓ Duplicate is now independent
- [ ] ✓ Original unchanged

---

## ARCHIVE TESTS ✅

### Test 19: Archive Project
- [ ] Find active project
- [ ] ✓ Status shows "Active"
- [ ] Click "◻ Archive"
- [ ] ✓ Confirmation appears
- [ ] Click OK
- [ ] ✓ Project appears dimmed
- [ ] ✓ Status shows "Archived"
- [ ] ✓ "Archived" badge appears on title
- [ ] Check frontend (/works)
- [ ] ✓ Archived project NOT visible

### Test 20: Restore Archived Project
- [ ] Find archived project (appears dimmed)
- [ ] ✓ Status shows "Archived"
- [ ] Click "↺ Restore"
- [ ] ✓ Confirmation appears
- [ ] Click OK
- [ ] ✓ Project returns to normal appearance
- [ ] ✓ Status shows "Active"
- [ ] Check frontend (/works)
- [ ] ✓ Project now visible again

### Test 21: Archive vs Delete
- [ ] Archive a project
- [ ] Check database
- [ ] ✓ Project still exists (archived: true)
- [ ] Can restore it
- [ ] Delete a project
- [ ] Check database
- [ ] ✓ Project completely removed

---

## ROLE & PERMISSION TESTS ✅

### Test 22: Admin Full Access
- [ ] Login as admin
- [ ] ✓ All buttons visible (Edit, Copy, Archive, Delete)
- [ ] Can perform all operations
- [ ] Can create categories
- [ ] Can delete projects

### Test 23: Expert Limited Access
- [ ] Login as expert
- [ ] ✓ Edit button: VISIBLE
- [ ] ✓ Archive button: VISIBLE
- [ ] ✓ Delete button: MISSING
- [ ] ✓ Copy button: MISSING
- [ ] Try to create category
- [ ] ✓ Can create new categories
- [ ] ✓ Permission error on delete attempt

### Test 24: Permission Check Alert
- [ ] Login as expert
- [ ] Inspect page source or network
- [ ] Try API call to delete
- [ ] ✓ API returns error (backend check)
- [ ] User-friendly message shown

---

## STATUS TRACKING TESTS ✅

### Test 25: Featured Badge
- [ ] Create project
- [ ] ✓ Featured column shows "-"
- [ ] Edit project
- [ ] Check "Featured Project"
- [ ] Save
- [ ] ✓ Featured column shows "★ Featured"
- [ ] Frontend homepage
- [ ] ✓ Project marked/highlighted if applicable

### Test 26: Created/Updated Dates
- [ ] Create project
- [ ] Check database
- [ ] ✓ createdAt: [today's date]
- [ ] Edit project
- [ ] ✓ updatedAt: [today's date]
- [ ] Wait, then edit again
- [ ] ✓ updatedAt updated, createdAt unchanged

---

## CATEGORY TESTS ✅

### Test 27: Default Categories
- [ ] Create new project form
- [ ] Click category dropdown
- [ ] ✓ See predefined:
  - [ ] Digital Marketing
  - [ ] Account Recovery
  - [ ] Media Production

### Test 28: Add Custom Category
- [ ] Click "+ New"
- [ ] Type "Web Design"
- [ ] Click "Create"
- [ ] ✓ New category added to dropdown
- [ ] ✓ "Web Design" is selected
- [ ] Create another project
- [ ] ✓ "Web Design" available in dropdown for new project

### Test 29: Filter by Category
- [ ] Go to /works
- [ ] ✓ "All" filter active
- [ ] Click "Digital Marketing"
- [ ] ✓ Only Digital Marketing projects shown
- [ ] Click different category
- [ ] ✓ Filters correctly

---

## GALLERY TESTS ✅

### Test 30: Add Gallery Images
- [ ] Create/edit project
- [ ] Add 3 image URLs
- [ ] Click "+ Add Images to Gallery"
- [ ] ✓ All 3 appear in grid
- [ ] ✓ Remove buttons visible

### Test 31: Remove Gallery Image
- [ ] In gallery preview
- [ ] Click ✕ on middle image
- [ ] ✓ Image removed
- [ ] ✓ Grid updates (shows 2 images)

### Test 32: Frontend Gallery Display
- [ ] Create project with 4 gallery images
- [ ] Save project
- [ ] Visit project detail page
- [ ] ✓ Gallery displays as grid
- [ ] ✓ Images clickable
- [ ] Click image
- [ ] ✓ Lightbox opens
- [ ] ✓ Can navigate with arrows
- [ ] ✓ Can close lightbox

---

## FEATURED CONTENT TESTS ✅

### Test 33: Featured Content Tab
- [ ] Admin dashboard
- [ ] Click "Featured Content" tab
- [ ] ✓ Featured content list shown
- [ ] Click "+ Add Featured Content"
- [ ] ✓ Form appears
- [ ] Fill fields and create
- [ ] ✓ Content appears in list

### Test 34: Edit Featured Content
- [ ] Click "✎ Edit" on featured content
- [ ] ✓ Form populates
- [ ] Modify and save
- [ ] ✓ Updates applied

### Test 35: Delete Featured Content
- [ ] Click "🗑 Delete" on featured content
- [ ] ✓ Confirmation appears
- [ ] Confirm deletion
- [ ] ✓ Content removed

---

## API TESTS ✅

### Test 36: Fetch All Projects
- [ ] Open Network tab
- [ ] Dashboard loads
- [ ] ✓ See `GET /api/projects` call
- [ ] ✓ Status 200
- [ ] ✓ Response contains project array

### Test 37: Create via API
- [ ] Network tab open
- [ ] Create project from form
- [ ] ✓ See `POST /api/projects` call
- [ ] ✓ Status 200
- [ ] ✓ Response shows new project with ID

### Test 38: Update via API
- [ ] Edit project from form
- [ ] ✓ See `PUT /api/projects/[id]` call
- [ ] ✓ Status 200
- [ ] ✓ Response shows updated fields

### Test 39: Delete via API
- [ ] Delete project
- [ ] ✓ See `DELETE /api/projects/[id]` call
- [ ] ✓ Status 200

### Test 40: Archive via API
- [ ] Archive project
- [ ] ✓ See `PATCH /api/projects/[id]/archive` call
- [ ] ✓ Status 200
- [ ] ✓ Response shows archived: true

---

## UI/UX TESTS ✅

### Test 41: Responsive Design
- [ ] Desktop (1920px+)
- [ ] ✓ All layouts clean
- [ ] Tablet (768px)
- [ ] ✓ Tables responsive
- [ ] Mobile (375px)
- [ ] ✓ Single column layout
- [ ] ✓ Buttons accessible

### Test 42: Error Messages
- [ ] Try invalid category input
- [ ] ✓ Clear error shown
- [ ] Try create without required fields
- [ ] ✓ Form validation works
- [ ] Network error scenario
- [ ] ✓ Error message shown

### Test 43: Loading States
- [ ] Dashboard loads
- [ ] ✓ "Loading projects..." message visible briefly
- [ ] ✓ Replaced with content
- [ ] Project form submit
- [ ] ✓ "Saving..." text on button
- [ ] ✓ Button disabled during save

### Test 44: Success Messages
- [ ] Create project
- [ ] ✓ Green success message appears
- [ ] ✓ Disappears after 3 seconds
- [ ] Edit project
- [ ] ✓ Success message shown
- [ ] Delete project
- [ ] ✓ Success confirmation

### Test 45: Logout
- [ ] Click "Logout"
- [ ] ✓ Redirected to login page
- [ ] ✓ localStorage cleared
- [ ] Refresh page
- [ ] ✓ Still on login page

---

## DATABASE TESTS ✅

### Test 46: Data Persistence
- [ ] Create project
- [ ] Restart dev server
- [ ] Dashboard loads
- [ ] ✓ Project still there
- [ ] ✓ Data persisted to file

### Test 47: ID Generation
- [ ] Create multiple projects
- [ ] ✓ Each has unique ID
- [ ] Delete middle ID
- [ ] Create new project
- [ ] ✓ New ID doesn't reuse deleted ID

### Test 48: Backup
- [ ] Manually copy /data/projects.json
- [ ] Delete some projects
- [ ] Restore backup
- [ ] Refresh dashboard
- [ ] ✓ Projects restored

---

## EDGE CASES ✅

### Test 49: Long Text Handling
- [ ] Create project with very long title (200+ chars)
- [ ] Save
- [ ] ✓ No truncation issues
- [ ] Very long description
- [ ] ✓ Textarea handles it
- [ ] Check frontend
- [ ] ✓ Displays correctly

### Test 50: Special Characters
- [ ] Title: "Project & Co. - "Special""
- [ ] Description with emoji: "🎬 Behind the scenes"
- [ ] Save
- [ ] ✓ Saved correctly
- [ ] Frontend
- [ ] ✓ Displays correctly

### Test 51: Duplicate Slug Handling
- [ ] Create project "test-project"
- [ ] Try to create another "test-project"
- [ ] Save
- [ ] ✓ Should work or show error (document behavior)

### Test 52: Empty Fields
- [ ] Attempt to save project with empty description
- [ ] ✓ Form validation prevents (marked required)
- [ ] Try optional fields (year, client)
- [ ] ✓ Can be empty
- [ ] Save
- [ ] ✓ Saves with empty optional fields

### Test 53: Concurrent Edits
- [ ] Open project edit in two tabs
- [ ] Edit and save in tab 1
- [ ] Edit and save in tab 2
- [ ] Refresh both
- [ ] ✓ Tab 2 changes preserved (last write wins)
- [ ] ✓ No data corruption

---

## FINAL VERIFICATION ✅

### Test 54: Complete Workflow
1. [ ] Login as admin
2. [ ] Create "Q1 2026 Campaign" project
3. [ ] Add gallery images
4. [ ] Add tags: "campaign", "social", "2026"
5. [ ] Mark as featured
6. [ ] Visit /works
7. [ ] ✓ Project visible and featured
8. [ ] Visit project detail
9. [ ] ✓ Gallery displays
10. [ ] Return to admin
11. [ ] Duplicate project
12. [ ] Edit duplicate for "Q2 2026 Campaign"
13. [ ] Archive old campaign
14. [ ] ✓ Only Q2 visible on frontend
15. [ ] Delete Q2
16. [ ] ✓ Removed from frontend
17. [ ] Restore Q1
18. [ ] ✓ Q1 returns to frontend

### Test 55: Expert Workflow
1. [ ] Logout, login as expert
2. [ ] Create new project
3. [ ] Try to duplicate
4. [ ] ✓ Button missing or permission error
5. [ ] Edit the project
6. [ ] ✓ Works fine
7. [ ] Archive project
8. [ ] ✓ Works fine
9. [ ] Try to delete
10. [ ] ✓ Permission denied or button missing

---

## PERFORMANCE TESTS ✅

### Test 56: Large Number of Projects
- [ ] Create 50+ projects
- [ ] Dashboard load time reasonable
- [ ] List renders without lag
- [ ] Filtering responsive

### Test 57: Large Gallery
- [ ] Create project with 20+ gallery images
- [ ] Save successfully
- [ ] Frontend gallery loads
- [ ] Lightbox responsive

---

## BROWSER COMPATIBILITY ✅

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## SIGN-OFF

- [ ] All tests passed
- [ ] No errors in console
- [ ] No network errors
- [ ] All data persists
- [ ] UI clean and responsive
- [ ] Ready for production ✅

**Test Date:** _____________
**Tester:** _____________
**Notes:** _____________
