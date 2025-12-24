import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', paddingBottom: '2rem' }}>
        <Outlet />
      </main>
    </>
  );
}