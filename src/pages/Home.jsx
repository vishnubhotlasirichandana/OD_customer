import { useEffect, useState } from 'react';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Pizza', label: '🍕 Pizza' },
  { id: 'Burger', label: '🍔 Burger' },
  { id: 'Biryani', label: '🍲 Biryani' },
  { id: 'Chinese', label: '🥢 Chinese' },
  { id: 'Dessert', label: '🍰 Dessert' },
  { id: 'Healthy', label: '🥗 Healthy' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await client.get('/restaurants?type=food_delivery');
        setRestaurants(data.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter Logic
  const filteredList = restaurants.filter(r => {
    const matchesSearch = r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.cuisineTypes.some(c => c.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="bg-primary pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Craving something?
          </h1>
          <p className="text-orange-100 text-lg mb-8">Order from the best restaurants near you</p>
          
          {/* Mobile Search (Visible only on small screens) */}
          <div className="md:hidden relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search restaurants..."
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 font-medium focus:outline-none shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 -mt-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-gray-500 pr-4 border-r border-gray-300">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                ${activeCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. RESTAURANT GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {activeCategory === 'all' ? 'Top Restaurants' : `${activeCategory} Places`}
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
            {filteredList.length} results
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white h-72 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥗</div>
            <h3 className="text-lg font-bold text-gray-900">No restaurants found</h3>
            <p className="text-gray-500">Try changing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredList.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}