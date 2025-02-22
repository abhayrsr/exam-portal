import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export function Layout() {
  const [isExamInProgress, setIsExamInProgress] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isExamInProgress={isExamInProgress} />
      <div className="flex">
        <Sidebar isExamInProgress={isExamInProgress} />
        <main className="flex-1 p-6">
          <Outlet context={{ setIsExamInProgress }} />
        </main>
      </div>
    </div>
  );
}