import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

export default function App() {
  return (
    <Routes>
      {/* All pages wrap inside MainLayout (Navbar + Content) */}
      <Route element={<MainLayout />}>
        
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        
        {/* Private Routes (Login Required) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Catch-all: Redirect unknown pages to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}