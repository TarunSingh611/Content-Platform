# ImageKit Setup Guide

This project uses ImageKit for media storage and management. Follow these steps to set up ImageKit:

## 1. Create ImageKit Account

1. Go to [ImageKit.io](https://imagekit.io) and create a free account
2. Complete the registration process

## 2. Get Your ImageKit Credentials

1. Log in to your ImageKit dashboard
2. Go to **Settings** → **Developer Options**
3. Copy the following credentials:
   - **Public Key**
   - **Private Key** 
   - **URL Endpoint**

## 3. Configure Environment Variables

1. Copy your `.env.example` to `.env` (if not already done)
2. Add your ImageKit credentials to `.env`:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
IMAGEKIT_FOLDER="CMS"
```

## 4. Create CMS Folder

1. In your ImageKit dashboard, go to **Media Library**
2. Create a new folder named `CMS`
3. This folder will store all your media files

## 5. Features

### Supported File Types
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Videos**: MP4, WebM, OGG
- **Documents**: PDF, DOC, DOCX

### File Size Limit
- Maximum file size: 50MB per file

### Features Included
- ✅ Drag & drop upload
- ✅ File type validation
- ✅ File size validation
- ✅ Image/video preview
- ✅ File management (edit, delete)
- ✅ Search and filter
- ✅ Grid/List view toggle
- ✅ Copy URL functionality
- ✅ Responsive design

## 6. Usage

1. Navigate to `/dashboard/media` in your application
2. Click "Upload Media" to open the upload modal
3. Drag and drop files or click to browse
4. Add an optional title for your media
5. Files will be uploaded to the `CMS` folder in ImageKit
6. View, edit, or delete your media files

## 7. Security

- All uploads are authenticated
- Files are stored securely in ImageKit
- Private keys are kept secure in environment variables
- File access is controlled through your ImageKit account

## 8. Troubleshooting

### Common Issues:

1. **Upload fails**: Check your ImageKit credentials in `.env`
2. **File too large**: Ensure files are under 50MB
3. **File type not supported**: Check the allowed file types list
4. **Authentication error**: Verify your ImageKit account is active

### Support:
- ImageKit Documentation: https://docs.imagekit.io/
- ImageKit Support: https://imagekit.io/support
