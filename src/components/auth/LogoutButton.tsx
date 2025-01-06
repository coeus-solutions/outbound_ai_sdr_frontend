import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the logout utility function
    const redirectPath = logout();
    
    // Call the optional onLogout callback
    onLogout?.();
    
    // Navigate to login page
    navigate(redirectPath);
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      type="button"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </button>
  );
} 