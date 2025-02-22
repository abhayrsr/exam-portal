import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export function Navbar({ isExamInProgress }: { isExamInProgress: boolean }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-indigo-600 font-bold text-lg"
            >
              Online Exam System
            </Link>
          </div>

          {!isExamInProgress && (
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="text-sm text-gray-700">
                    <User className="h-4 w-4 inline-block mr-1" />
                    {user?.name}
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-gray-900 text-sm flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}