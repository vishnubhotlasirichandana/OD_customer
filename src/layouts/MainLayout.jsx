import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar stays fixed or sticky at the top */}
      <Navbar />
      
      {/* Content Area - Grows to fill space */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      
      {/* Optional: Add a simple Footer here later */}
    </div>
  );
}