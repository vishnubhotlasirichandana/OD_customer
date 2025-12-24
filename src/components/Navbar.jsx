import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
      <div className="container flex-between">
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          FoodApp
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} /> Cart
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <User size={20} /> {user.fullName}
              </div>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}