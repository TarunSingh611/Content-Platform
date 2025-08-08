export interface MediaFile {
  id: string
  title: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  size: number
  format: string
  width?: number
  height?: number
  createdAt: string
  updatedAt: string
}

export interface MediaUploadProps {
  onUploadSuccess: (media: MediaFile) => void
  onUploadError: (error: string) => void
}
