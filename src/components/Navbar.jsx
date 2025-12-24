import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, MapPin, Search, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  
  // Hide search in Navbar if we are on the Home page (prevents duplication)
  const isHomePage = location.pathname === '/';
  
  const userName = user?.fullName ? user.fullName.split(' ')[0] : 'User';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-black tracking-tight text-orange-600 flex items-center gap-1">
            OrderNow<span className="text-gray-900">.</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 cursor-pointer transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <MapPin size={16} className="text-orange-500" />
            <span className="font-bold truncate max-w-[150px]">
              London, UK
            </span>
          </div>
        </div>

        {/* CENTER: Search Bar (Hidden on Home Page) */}
        {!isHomePage && (
          <div className="hidden md:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search for restaurants..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-200 rounded-xl text-sm transition-all outline-none font-medium"
              />
            </div>
          </div>
        )}

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group">
            <ShoppingBag size={24} className="text-gray-700 group-hover:text-orange-600 transition-colors" />
            {cart?.length > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">Member</span>
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
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}