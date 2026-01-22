# Featured Content Management Guide

## 🎬 New Feature: Featured Content

Your admin panel now includes a **Featured Content** section where you can add:
- ✅ Images
- ✅ Videos (YouTube, Vimeo, etc.)
- ✅ Text Content
- ✅ Embedded Media

---

## 📱 How to Use

### **Access Featured Content**
1. Go to `http://localhost:3000/admin/dashboard`
2. Click the **"Featured Content"** tab
3. Click **"+ Add Featured Content"**

---

## 🖼️ Adding Images

### **Method 1: Local Images**
1. Select Content Type: **Image**
2. Add Title (e.g., "Our Latest Project")
3. Add Description (optional)
4. Image URL: `/images/projects/work1.jpg`
   - Use paths from your `public/images/` folder
5. Thumbnail URL: (optional) same as Image URL
6. Click **"Add Content"**

### **Method 2: External Images**
1. Select Content Type: **Image**
2. Image URL: `https://example.com/image.jpg`
3. Add other details
4. Submit

### **Image Preview**
- The form shows a live preview of your image
- Perfect for checking if the path is correct

---

## 🎥 Adding Videos

### **YouTube Videos**

**Option A: Share Link**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
✅ Automatically converts to embed URL

**Option B: Shortened Link**
```
https://youtu.be/dQw4w9WgXcQ
```
✅ Also auto-converts

**Option C: Embed Code**
```
https://www.youtube.com/embed/dQw4w9WgXcQ
```
✅ Direct embed URL

### **Vimeo Videos**
```
https://vimeo.com/123456789
or
https://player.vimeo.com/video/123456789
```

### **Steps to Add Video**
1. Select Content Type: **Video**
2. Video Source: Select **YouTube**, **Vimeo**, or **Custom**
3. Paste Video URL in the text area
4. Add Title and Description
5. Mark as Featured (if desired)
6. Click **"Add Content"**

---

## 📝 Adding Text Content

### **Simple Text Posts**
1. Select Content Type: **Text**
2. Add Title
3. Write your content in the Description field
4. Can include multiple paragraphs
5. Click **"Add Content"**

---

## ⭐ Featured vs Draft

### **Mark as Featured**
- Check the **"Featured"** checkbox to display on your website
- Only featured content shows on the frontend
- Uncheck to hide without deleting

### **Draft Content**
- Uncheck "Featured" to save as draft
- Useful for preparing content before publishing

---

## 🔧 Edit & Delete

### **Edit Existing Content**
1. Find the content in the table
2. Click the **"Edit"** button
3. Modify details
4. Click **"Update Content"**

### **Delete Content**
1. Click **"Delete"** button
2. Confirm deletion
3. Content is permanently removed

---

## 📊 Content Management Table

The Featured Content table shows:
- **ID**: Unique identifier
- **Preview**: Thumbnail (image/video/text)
- **Title**: Content title
- **Type**: Image, Video, or Text
- **Featured**: ★ if marked featured, - if draft
- **Date**: When it was created
- **Actions**: Edit or Delete buttons

---

## 💡 Content Type Details

### **Image Type**
```json
{
  "type": "image",
  "title": "Project Showcase",
  "mediaUrl": "/images/projects/work1.jpg",
  "thumbnail": "/images/projects/work1.jpg",
  "content": "Beautiful project completed",
  "featured": true
}
```

### **Video Type**
```json
{
  "type": "video",
  "title": "Behind the Scenes",
  "mediaUrl": "https://www.youtube.com/watch?v=xxx",
  "mediaType": "youtube",
  "content": "Check out our video",
  "featured": true
}
```

### **Text Type**
```json
{
  "type": "text",
  "title": "Announcement",
  "content": "We're excited to announce...",
  "featured": true
}
```

---

## 🎨 Using Featured Content on Your Website

### **Display Featured Content Component**

Add to any page in `src/app/`:

```jsx
import FeaturedContent from '@/components/sections/featuredContent';

export default function Page() {
  return (
    <>
      <YourOtherSections />
      <FeaturedContent />
      <MoreSections />
    </>
  );
}
```

### **Example: Home Page**

In `src/app/page.js`:

```jsx
import Hero from '@/components/sections/hero';
import FeaturedContent from '@/components/sections/featuredContent';
import ServiceGrid from '@/components/sections/serviceGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedContent />
      <ServiceGrid />
    </>
  );
}
```

---

## 🎯 Best Practices

### **Images**
- ✅ Use high-quality images (1200x800px or larger)
- ✅ Keep file sizes reasonable (< 500KB)
- ✅ Use consistent aspect ratios
- ✅ Organize in `public/images/` folder

### **Videos**
- ✅ Use YouTube for best compatibility
- ✅ Test embed URLs in preview
- ✅ Use descriptive titles
- ✅ Always include descriptions

### **Text**
- ✅ Keep titles concise
- ✅ Use clear, readable descriptions
- ✅ Break long text into paragraphs
- ✅ Proofread before publishing

---

## 📁 File Structure

```
data/
└── featured-content.json    ← Stores all featured content

src/
├── app/api/featured-content/
│   ├── route.js            ← GET/POST endpoints
│   └── [id]/route.js       ← GET/PUT/DELETE endpoints
├── components/
│   ├── admin/
│   │   ├── AddFeaturedContentForm.jsx
│   │   └── FeaturedContentList.jsx
│   └── sections/
│       └── featuredContent.jsx  ← Frontend display
└── assets/css/
    └── admin.css            ← Styling
```

---

## 🔌 API Endpoints

```
GET    /api/featured-content              # Get all content
POST   /api/featured-content              # Create new content
GET    /api/featured-content/[id]         # Get single content
PUT    /api/featured-content/[id]         # Update content
DELETE /api/featured-content/[id]         # Delete content
```

---

## 🐛 Troubleshooting

### **Images not showing?**
- ✅ Check file exists in `public/images/`
- ✅ Use correct path (with leading `/`)
- ✅ Try full URL if available
- ✅ Check file name (case-sensitive on Linux)

### **Videos not playing?**
- ✅ Use YouTube or Vimeo official URLs
- ✅ Ensure video is public (not private/restricted)
- ✅ Try different video source
- ✅ Check console for CORS errors

### **Content not showing on website?**
- ✅ Verify content is marked as **Featured**
- ✅ Add the `<FeaturedContent />` component to your page
- ✅ Check browser console for errors
- ✅ Restart dev server

### **Edits not saving?**
- ✅ Check browser console for errors
- ✅ Verify `data/featured-content.json` exists
- ✅ Check file permissions
- ✅ Try clearing browser cache

---

## 🎁 Advanced Uses

### **Gallery**
Create a photo gallery by adding multiple images with the same featured status.

### **Media Mix**
Combine images, videos, and text for rich content sections.

### **Announcements**
Use text content for important announcements and updates.

### **Portfolio Showcase**
Display videos of your work alongside images and descriptions.

---

## 📚 Learn More

- [Featured Content API](../ADMIN_PANEL_README.md)
- [Admin Panel Guide](../ADMIN_PANEL_README.md)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Embedding Videos](https://developers.google.com/youtube/iframe_api_reference)

---

**Questions?** Check the error messages in your browser console for specific issues!
