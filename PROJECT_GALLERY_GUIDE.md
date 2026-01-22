# Complete Project Management Guide

## 🎯 Overview

Your admin panel now has **complete project management** with:
- ✅ Full project details (title, description, role, client, services, year)
- ✅ Thumbnail image
- ✅ **Gallery with multiple images** (Behind-the-scenes, process photos, etc.)
- ✅ Featured/Draft status
- ✅ Live frontend display with lightbox viewer

---

## 📋 Project Fields

### **Basic Information**
| Field | Description | Required |
|-------|-------------|----------|
| Project Title | Name of the project | ✅ Yes |
| Slug | URL-friendly identifier | ✅ Yes |
| Category | Type (Digital Marketing, Account Recovery, Media Production) | ✅ Yes |
| Year | Project year (e.g., 2026) | ❌ No |

### **Team Information**
| Field | Description |
|-------|-------------|
| Client | Client name |
| Role / Position | Your role (e.g., Assistant Director (AD)) |
| Services | Services provided |

### **Content**
| Field | Description | Required |
|-------|-------------|----------|
| Excerpt | Short 1-2 line description | ✅ Yes |
| Full Description | Detailed project description | ✅ Yes |

### **Media**
| Field | Description | Required |
|-------|-------------|----------|
| Thumbnail Image | Main project image | ✅ Yes |
| Gallery Images | Behind-the-scenes, process, results (multiple) | ❌ No |

---

## 🖼️ How to Add a Project with Gallery

### **Step 1: Go to Admin Dashboard**
1. Navigate to `http://localhost:3000/admin/dashboard`
2. Make sure you're on the **"Projects & Works"** tab
3. Click **"+ Add New Project"**

### **Step 2: Fill Project Details**

```
Project Title: Direct Short Film for Borey Rachana
Slug: borey-rachana-short-film
Category: Media Production
Year: 2026
Client: Borey Rachana
Role: Assistant Director (AD)
Services: Media Production
Excerpt: Professional video production for films, TVCs, and commercial campaigns.
Description: Direct Short Film for Borey Rachana is an upcoming 2026 media production project where I serve as the Assistant Director...
Thumbnail Image: /images/projects/work6.jpg
```

### **Step 3: Add Gallery Images**

**In the "Add Gallery Images" section:**

```
Paste image URLs (one per line):

/images/projects/media-production/borey-rachana-shortfilm/cover.jpg
/images/projects/media-production/borey-rachana-shortfilm/bts1.jpg
/images/projects/media-production/borey-rachana-shortfilm/bts2.jpg
/images/projects/media-production/borey-rachana-shortfilm/bts3.jpg
```

Click **"+ Add Images to Gallery"**

**Result:** Gallery preview shows all 4 images in a grid. You can remove individual images by clicking the ✕ button.

### **Step 4: Publish**

1. Check "Featured Project" if you want it to show on your website
2. Click **"Add Project"**
3. Project appears in the table immediately

---

## 🎬 Project Data Structure

```json
{
  "id": 6,
  "title": "Project Borey Rachana",
  "slug": "borey-rachana-short-film",
  "category": "Media Production",
  "year": "2026",
  "client": "Borey Rachana",
  "role": "Assistant Director (AD)",
  "services": "Media Production",
  "excerpt": "Professional video production...",
  "description": "Full detailed description...",
  "src": "/images/projects/work6.jpg",
  "gallery": [
    "/images/projects/media-production/borey-rachana-shortfilm/cover.jpg",
    "/images/projects/media-production/borey-rachana-shortfilm/bts1.jpg",
    "/images/projects/media-production/borey-rachana-shortfilm/bts2.jpg",
    "/images/projects/media-production/borey-rachana-shortfilm/bts3.jpg"
  ],
  "featured": true,
  "createdAt": "2026-01-21"
}
```

---

## 🌐 Display on Website

### **Using the Gallery Component**

Add to your project detail page in `src/app/works/[slug]/page.js`:

```jsx
import ProjectGallery from '@/components/sections/projectGallery';

export default function ProjectPage() {
  const project = { /* project data */ };

  return (
    <>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <ProjectGallery gallery={project.gallery} />
    </>
  );
}
```

### **Frontend Features**

✅ **Gallery Grid** - Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)  
✅ **Image Hover** - Shows eye icon on hover  
✅ **Lightbox Viewer** - Click to view full-size with navigation  
✅ **Previous/Next** - Navigate through images  
✅ **Image Counter** - Shows "X / Total"  
✅ **Close Button** - ESC key or click to close  

---

## ✏️ Edit a Project

### **With Gallery**

1. Click **"Edit"** button next to project
2. All fields load (including gallery images)
3. **Add more images:**
   - Paste new URLs in the textarea
   - Click "+ Add Images to Gallery"
4. **Remove images:**
   - Click ✕ button on image in preview
5. Click **"Update Project"**

---

## 🗑️ Delete a Project

1. Click **"Delete"** button
2. Confirm deletion
3. Project immediately removed

---

## 💾 File Structure

```
data/
└── projects.json              # All project data with galleries

src/
├── components/sections/
│   └── projectGallery.jsx     # Gallery display component
├── assets/css/
│   └── style.css              # Gallery styles (lightbox, grid)
└── app/api/projects/
    ├── route.js               # GET/POST endpoints
    └── [id]/route.js          # GET/PUT/DELETE endpoints
```

---

## 🎯 Example: Complete Project Entry

### Admin Panel Input:

```
Title: Facebook Page & Account Recovery
Slug: facebook-page-account-recovery
Category: Account Recovery
Year: 2024
Client: Digital Client
Role: Account Recovery Specialist
Services: Facebook Recovery, Admin Restoration
Excerpt: Recover disabled Facebook pages and accounts
Description: Professional account recovery service helping businesses restore their disabled Facebook pages and accounts. We assist with admin access restoration, security improvements, and account verification.

Thumbnail: /images/projects/work1.jpg

Gallery Images:
/images/projects/facebook/dashboard.jpg
/images/projects/facebook/process.jpg
/images/projects/facebook/recovery.jpg
/images/projects/facebook/final.jpg
```

### Website Display:

- **Works Page**: Shows project card with thumbnail
- **Project Detail Page**: 
  - Full project information (Year, Client, Role, Services)
  - Complete description
  - 4-image gallery with lightbox viewer
  - All interactive navigation

---

## 📱 Responsive Behavior

| Device | Gallery Grid | Image Count |
|--------|-------------|-------------|
| Desktop | 4 columns | Shows all |
| Tablet | 2 columns | Responsive |
| Mobile | 1 column | Stacked |

---

## 🔒 Best Practices

### **Image Naming**
```
✅ Good:
/images/projects/borey-rachana/cover.jpg
/images/projects/facebook/process-01.jpg
/images/projects/digital-marketing/result.jpg

❌ Bad:
/images/projects/image1.jpg
/images/photo.jpg
C:\Users\Desktop\image.jpg
```

### **Image Optimization**
- Use consistent dimensions (16:9 aspect ratio recommended)
- Compress images (< 500KB per image)
- Use modern formats (JPG for photos, PNG for graphics)

### **Gallery Tips**
- Add 3-5 images per project for best results
- Order images: thumbnail → process → results → detail
- Use high-quality behind-the-scenes photos
- Show different angles and stages of project

---

## 🔧 API Endpoints

```
GET    /api/projects              # Get all projects
POST   /api/projects              # Create new project
GET    /api/projects/[id]         # Get single project
PUT    /api/projects/[id]         # Update project (including gallery)
DELETE /api/projects/[id]         # Delete project
```

### **Update Request Example**

```json
PUT /api/projects/6

{
  "title": "Updated Title",
  "gallery": [
    "/images/new-image1.jpg",
    "/images/new-image2.jpg",
    "/images/new-image3.jpg"
  ]
}
```

---

## ⚙️ Configuration

### **Change Gallery Grid Layout**

Edit `src/assets/css/style.css`:

```css
.gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* Change 250px to adjust image size */
  /* Change repeat(auto-fill, ...) for fixed columns */
}

/* Example: Exactly 3 columns */
.gallery-grid {
  grid-template-columns: repeat(3, 1fr);
}
```

### **Customize Lightbox**

Edit `src/components/sections/projectGallery.jsx`:

```jsx
// Modify lightbox styling, navigation, counter display
// Adjust animation speed, close behavior, etc.
```

---

## 🐛 Troubleshooting

### **Gallery images not showing?**
- ✅ Check image paths are correct
- ✅ Verify images exist in `public/images/` folder
- ✅ Use leading `/` for all paths
- ✅ Test URL in browser directly

### **Gallery images showing but gallery section missing?**
- ✅ Add `<ProjectGallery gallery={project.gallery} />` to your page
- ✅ Import component: `import ProjectGallery from '@/components/sections/projectGallery'`
- ✅ Pass gallery array: `gallery={project.gallery}`

### **Lightbox not opening?**
- ✅ Check browser console for JavaScript errors
- ✅ Verify gallery has at least one image
- ✅ Try in different browser
- ✅ Clear cache

### **Images cut off or stretched?**
- ✅ Check image aspect ratio (should be square for best results)
- ✅ Use CSS to adjust: `object-fit: cover` or `contain`
- ✅ Resize images to same dimensions

---

## 📚 Learn More

- [Featured Content Management](./FEATURED_CONTENT_GUIDE.md)
- [Admin Panel Setup](./ADMIN_PANEL_README.md)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

---

**Your projects are now fully manageable with rich galleries! 🎉**
