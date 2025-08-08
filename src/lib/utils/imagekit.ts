import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  fileType: string;
  height?: number;
  width?: number;
}

export interface MediaFile {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Upload file to ImageKit
export async function uploadToImageKit(
  file: Buffer,
  fileName: string,
  folder: string = 'CMS'
): Promise<UploadResponse> {
  try {
    const uploadResponse = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      tags: ['cms-media'],
      responseFields: ['isPrivateFile', 'tags'],
    });

    return {
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
      size: uploadResponse.size,
      fileType: uploadResponse.fileType,
      height: uploadResponse.height,
      width: uploadResponse.width,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload file to ImageKit');
  }
}

// Delete file from ImageKit
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    return false;
  }
}

// Get file info from ImageKit
export async function getFileInfo(fileId: string): Promise<any> {
  try {
    const fileInfo = await imagekit.getFileDetails(fileId);
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info from ImageKit:', error);
    throw new Error('Failed to get file info from ImageKit');
  }
}

// List files from ImageKit folder
export async function listFilesFromFolder(folder: string = 'CMS'): Promise<any[]> {
  try {
    const files = await imagekit.listFiles({
      path: folder,
      limit: 100,
    });
    return files;
  } catch (error) {
    console.error('Error listing files from ImageKit:', error);
    throw new Error('Failed to list files from ImageKit');
  }
}

// Generate upload signature for client-side uploads
export function getUploadSignature(): { signature: string; expire: number; token: string } {
  const expire = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
  const token = imagekit.getAuthenticationParameters();
  
  return {
    signature: token.signature,
    expire: expire,
    token: token.token,
  };
}

export default imagekit;
