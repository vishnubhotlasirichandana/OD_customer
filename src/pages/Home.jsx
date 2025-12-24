import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Fixed import
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, SlidersHorizontal, ArrowRight, Pizza, Coffee, Utensils } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <Utensils size={16} /> },
  { id: 'Pizza', label: 'Pizza', icon: <Pizza size={16} /> },
  { id: 'Burger', label: 'Burger', icon: <Utensils size={16} /> },
  { id: 'Biryani', label: 'Biryani', icon: <Utensils size={16} /> },
  { id: 'Chinese', label: 'Chinese', icon: <Utensils size={16} /> },
  { id: 'Healthy', label: 'Healthy', icon: <Utensils size={16} /> },
  { id: 'Dessert', label: 'Dessert', icon: <Coffee size={16} /> },
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

  const filteredList = restaurants.filter(r => {
    const matchesSearch = r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.cuisineTypes.some(c => c.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 px-4 shadow-lg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-sm">
            Cravings? <br/> Consider it done.
          </h1>
          <p className="text-orange-50 text-lg mb-8 max-w-xl mx-auto font-medium">
            Order from the best restaurants in town and get it delivered at lightning speed.
          </p>
          
          {/* Search Input */}
          <div className="relative max-w-lg mx-auto">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search restaurants or cuisines..."
               className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/30 shadow-2xl"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-gray-500 pr-4 border-r border-gray-300 shrink-0">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Filters</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 shrink-0
                ${activeCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
              `}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {activeCategory === 'all' ? 'Top Picks For You' : `Best ${activeCategory} Places`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[280px] animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-orange-50 p-6 rounded-full mb-4">
              <Search size={40} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">We couldn't find matches for "{searchTerm}".</p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveCategory("all");}}
              className="mt-6 text-orange-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredList.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}