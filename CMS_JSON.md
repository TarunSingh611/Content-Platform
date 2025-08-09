
### CMS Integration JSON

```json
{
  "project": {
    "name": "ai-content-platform",
    "framework": "Next.js",
    "typescript": true,
    "nodeVersion": "18.x",
    "envExample": {
      "DATABASE_URL": "mongodb://localhost:27017/ai-content-platform",
      "NEXTAUTH_URL": "http://localhost:3000",
      "NEXTAUTH_SECRET": "your-nextauth-secret",
      "CMS_BASE_URL": "http://localhost:3000",
      "IMAGEKIT_URL": "https://ik.imagekit.io/your-endpoint",
      "FIREBASE_STORAGE_BUCKET": "your-firebase-storage-bucket"
    }
  },
  "database": {
    "provider": "mongodb",
    "connectionString": "mongodb://localhost:27017/ai-content-platform",
    "collections": {
      "users": {
        "name": "User",
        "schema": {
          "id": "ObjectId string, _id in db",
          "name": "string|null",
          "email": "string unique",
          "password": "string|undefined (hashed bcrypt if present)",
          "image": "string|null",
          "websiteUrl": "string|null",
          "bio": "string|null",
          "role": "USER|ADMIN",
          "createdAt": "Date",
          "updatedAt": "Date"
        },
        "indexes": ["email unique"]
      },
      "contents": {
        "name": "Content",
        "schema": {
          "id": "ObjectId string, _id in db",
          "title": "string",
          "description": "string|null",
          "content": "string (HTML/Markdown)",
          "excerpt": "string|null",
          "coverImage": "string|null",
          "published": "boolean",
          "featured": "boolean",
          "authorId": "ObjectId string",
          "tags": "string[]|undefined",
          "seoTitle": "string|null|undefined",
          "seoDescription": "string|null|undefined",
          "seoKeywords": "string[]|undefined",
          "slug": "string|null|undefined",
          "views": "number",
          "likes": "number|undefined",
          "shares": "number|undefined",
          "comments": "number|undefined",
          "readingTime": "number|undefined",
          "createdAt": "Date",
          "updatedAt": "Date"
        },
        "indexes": ["authorId", "published", "featured", "slug (not unique)"]
      },
      "media": {
        "name": "Media",
        "storage": "imagekit",
        "fields": [
          "id",
          "title",
          "type",
          "url",
          "thumbnail",
          "size",
          "format",
          "width",
          "height",
          "userId",
          "createdAt",
          "updatedAt"
        ]
      }
    }
  },
  "auth": {
    "provider": "NextAuth Credentials",
    "passwords": "bcrypt",
    "loginEndpoint": "http://localhost:3000/api/auth/callback/credentials",
    "sessionStrategy": "jwt",
    "jwtCallbacks": {
      "addsRoleToToken": true,
      "addsRoleToSession": true
    },
    "demoAccount": {
      "email": "",
      "password": "",
      "role": "USER",
      "id": ""
    }
  },
  "api": {
    "baseUrl": "http://localhost:3000",
    "endpoints": {
      "listContent": "GET /api/content",
      "getContent": "GET /api/content/{id}",
      "createContent": "POST /api/content",
      "updateContent": "PUT /api/content/{id}",
      "deleteContent": "DELETE /api/content/{id}",
      "incrementViews": "",
      "mediaList": "GET /api/media",
      "mediaUpload": "POST /api/media",
      "analytics": "GET /api/analytics"
    },
    "authHeader": "Authorization: Bearer <session-token or cookie>"
  },
  "contentRules": {
    "draftsVisible": "yes when author",
    "featuredLogic": "boolean flag",
    "slugUniqueness": false,
    "allowedHtml": "raw"
  },
  "webhooks": {
    "enabled": false,
    "events": ["content.created", "content.updated", "content.deleted"],
    "destination": ""
  }
}
```
