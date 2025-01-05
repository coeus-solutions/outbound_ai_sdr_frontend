import React, { useRef } from 'react';
import { ReactNode } from 'react';

interface FileUploadProps {
  accept: string;
  onUpload: (file: File) => void;
  buttonText: string;
  icon?: ReactNode;
}

export function FileUpload({ accept, onUpload, buttonText, icon }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {icon}
        {buttonText}
      </button>
    </div>
  );
}