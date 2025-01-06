import React, { useRef } from 'react';

interface FileUploadProps {
  accept: string;
  onUpload: (file: File) => void;
  buttonText: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function FileUpload({ accept, onUpload, buttonText, icon, disabled }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {icon}
        {buttonText}
      </button>
    </div>
  );
}