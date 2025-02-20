import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/',
    },
    {
      name: 'Exams',
      href: role === 'Admin' ? '/admin/exams' : '/exams',
      icon: BookOpen,
      current: location.pathname === '/exams' ||location.pathname === '/admin/exams',
    },
  ];

  console.log('Exams Link:', role === 'Admin' ? '/admin/exams' : '/exams');

  if (role === 'teacher' || role === 'Admin') {
    navigation.push({
      name: 'Create Exam',
      href: '/exams/create',
      icon: PlusCircle,
      current: location.pathname === '/exams/create',
    });
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    item.current
                      ? 'text-indigo-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}