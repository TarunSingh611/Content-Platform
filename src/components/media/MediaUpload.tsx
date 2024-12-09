'use client';
import { useState } from "react";
export default function MediaUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleDragOver = (e:any) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = () => {
      setIsDragging(false);
    };
  
    const handleDrop = async (e:any) => {
      e.preventDefault();
      setIsDragging(false);
  
      const files = Array.from(e.dataTransfer.files);
      await uploadFiles(files);
    };
  
    const handleFileSelect = async (e:any) => {
      const files = Array.from(e.target.files);
      await uploadFiles(files);
    };
  
    const uploadFiles = async (files:any) => {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
  
        try {
          const response = await fetch('/api/media', {
            method: 'POST',
            body: formData
          });
  
          setUploadProgress(((i + 1) / files.length) * 100);
  
          if (!response.ok) {
            throw new Error('Upload failed');
          }
        } catch (error) {
          console.error('Upload error:', error);
        }
      }
  
      // Reset progress after short delay
      setTimeout(() => setUploadProgress(0), 1000);
    };
  
    return (
      <div className="w-full max-w-md mx-auto">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-gray-600">
              <label className="cursor-pointer hover:text-indigo-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                />
              </label>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
  
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }