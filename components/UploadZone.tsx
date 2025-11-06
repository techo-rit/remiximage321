import React, { useState, useCallback, DragEvent, useId } from 'react';
import { UploadIcon } from './Icons';

interface UploadZoneProps {
  onFileChange: (file: File | null) => void;
  title: string;
  subtitle: 'Required' | 'Optional';
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileChange, title, subtitle }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();

  const handleFile = useCallback((file: File | null) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp")) {
        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB. Please choose a smaller file.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onFileChange(file);
    } else if (file) {
        alert("Invalid file type. Please upload a JPG, PNG, or WebP file.");
    }
  }, [onFileChange]);

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
        <p className="block text-lg font-semibold text-gray-700 mb-2">{title} <span className={`text-sm font-normal ${subtitle === 'Required' ? 'text-red-500' : 'text-gray-400'}`}>({subtitle})</span></p>
        <label
          htmlFor={inputId}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`relative block w-full aspect-square border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'} focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-400`}
        >
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`${title} (${subtitle})`}
          />
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-2xl p-2" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 pointer-events-none">
                <UploadIcon />
                <p className="mt-2 text-center">Drag & drop or <span className="font-semibold text-purple-500">click to browse</span></p>
                <p className="text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
            </div>
          )}
        </label>
    </div>
  );
};