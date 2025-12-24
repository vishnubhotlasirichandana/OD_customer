import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, MapPin, Search, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-black tracking-tight text-orange-600">
            OrderNow<span className="text-gray-900">.</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 cursor-pointer transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <MapPin size={16} />
            <span className="font-medium truncate max-w-[150px]">
              Hyderabad, Telangana
            </span>
          </div>
        </div>

        {/* CENTER: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg relative mx-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search for restaurants, cuisines..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200 rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ShoppingBag size={22} className="text-gray-700" />
            {cart?.length > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {user.fullName?.split(' ')[0]}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Member</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}