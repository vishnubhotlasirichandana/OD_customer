import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, MapPin, Search, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-8">
        
        {/* 1. Logo & Location */}
        <div className="flex items-center gap-8 min-w-fit">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
            OrderNow
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-primary cursor-pointer transition-colors">
            <MapPin size={18} />
            <span className="font-medium underline decoration-dotted underline-offset-4">
              Select Location
            </span>
          </div>
        </div>

        {/* 2. Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search for restaurants and food..."
            className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* 3. Right Actions */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative group">
            <ShoppingBag size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
            {cart?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm font-semibold text-gray-700">
                {user.fullName?.split(' ')[0]}
              </span>
              <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-transform active:scale-95">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}