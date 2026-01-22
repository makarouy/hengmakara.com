# Admin Panel API Reference

## Authentication

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "base64_encoded_token",
  "username": "admin",
  "email": "admin@hengmakara.com",
  "role": "admin",
  "permissions": ["create", "read", "update", "delete", "archive", "duplicate"]
}
```

## Projects

### Get All Projects
```
GET /api/projects

Response: [{ project objects }]
```

### Get Single Project
```
GET /api/projects/[id]

Response: { project object }
```

### Create Project
```
POST /api/projects
Content-Type: application/json

{
  "title": "Project Name",
  "slug": "project-slug",
  "category": "Digital Marketing",
  "year": "2026",
  "client": "Client Name",
  "role": "Position",
  "services": "Services",
  "excerpt": "Short description",
  "description": "Full description",
  "src": "/images/thumbnail.jpg",
  "gallery": ["/images/img1.jpg"],
  "tags": ["tag1", "tag2"],
  "featured": false
}

Response: { created project object with auto-generated id }
```

### Update Project
```
PUT /api/projects/[id]
Content-Type: application/json

{ any fields to update }

Response: { updated project object }
```

### Delete Project
```
DELETE /api/projects/[id]

Response: { "message": "Project deleted" }
```

### Duplicate Project
```
POST /api/projects/[id]/duplicate

Response: {
  ...copied project data,
  "id": new_id,
  "title": "Original Title (Copy)",
  "slug": "original-slug-copy-1234567890",
  "featured": false,
  "archived": false
}
```

### Archive/Unarchive Project
```
PATCH /api/projects/[id]/archive
Content-Type: application/json

{
  "archived": true  // or false to unarchive
}

Response: { updated project object with archived status }
```

## Featured Content

### Get All Featured Content
```
GET /api/featured-content

Response: [{ content objects }]
```

### Get Single Featured Content
```
GET /api/featured-content/[id]

Response: { content object }
```

### Create Featured Content
```
POST /api/featured-content
Content-Type: application/json

{
  "title": "Content Title",
  "description": "Description",
  "type": "image|video|text",
  "content": "URL or content",
  ...
}

Response: { created content object with auto-generated id }
```

### Update Featured Content
```
PUT /api/featured-content/[id]
Content-Type: application/json

{ any fields to update }

Response: { updated content object }
```

### Delete Featured Content
```
DELETE /api/featured-content/[id]

Response: { "message": "Content deleted" }
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to [operation]"
}
```

## Database Files

- `/data/admin.json` - Admin credentials and roles
- `/data/projects.json` - All projects
- `/data/featured-content.json` - Featured content

## Frontend Routes

- `/admin` - Login page
- `/admin/dashboard` - Admin dashboard
- `/works` - All projects page
- `/works/[slug]` - Project detail page

## User Roles

### Admin
- Can perform all operations
- Can delete projects
- Can duplicate projects
- Can manage users

### Expert
- Can create/read/update projects
- Can archive projects
- Cannot delete projects
- Cannot duplicate projects
