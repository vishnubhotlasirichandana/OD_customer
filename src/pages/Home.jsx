import { useEffect, useState } from 'react';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Filter, ShoppingBag } from 'lucide-react';

// Static Categories for Filter Demo
const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'Pizza', label: 'Pizza', icon: '🍕' },
  { id: 'Burger', label: 'Burger', icon: '🍔' },
  { id: 'Biryani', label: 'Biryani', icon: '🍲' },
  { id: 'Chinese', label: 'Chinese', icon: '🥡' },
  { id: 'Dessert', label: 'Dessert', icon: '🍰' },
  { id: 'Healthy', label: 'Healthy', icon: '🥗' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await client.get('/restaurants?type=food_delivery');
        const list = data.data || [];
        setRestaurants(list);
        setFilteredRestaurants(list);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    let result = restaurants;

    // 1. Filter by Search
    if (searchTerm) {
      result = result.filter(r => 
        r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 2. Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(r => 
        r.cuisineTypes.some(c => c.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    setFilteredRestaurants(result);
  }, [searchTerm, activeCategory, restaurants]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 pb-20 pt-10 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Craving something delicious?
          </h1>
          <p className="text-white/80 text-lg mb-8">Order from the best restaurants near you</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 rounded-full border-none shadow-2xl focus:ring-2 focus:ring-orange-300 bg-white text-gray-900 placeholder-gray-400 text-lg"
              placeholder="Search for 'Biryani', 'Pizza', or restaurant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 pb-20">
        
        {/* CATEGORY FILTERS (Horizontal Scroll) */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex gap-4 overflow-x-auto no-scrollbar items-center">
          <div className="flex items-center gap-2 text-gray-400 pr-4 border-r border-gray-100">
            <Filter size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Filters</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat.id 
                  ? 'bg-orange-100 border-orange-200 text-orange-700 font-bold shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-sm">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeCategory === 'all' ? 'All Restaurants' : `Best ${activeCategory} Places`}
          </h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            {filteredRestaurants.length} results
          </span>
        </div>

        {/* RESTAURANT GRID */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white h-72 rounded-2xl shadow-sm animate-pulse flex flex-col overflow-hidden">
                <div className="h-40 bg-gray-200 w-full" />
                <div className="p-4 flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Restaurants Found</h3>
            <p className="text-gray-500">Try changing your search term or filter.</p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveCategory("all");}}
              className="mt-4 text-orange-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          // Data Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}