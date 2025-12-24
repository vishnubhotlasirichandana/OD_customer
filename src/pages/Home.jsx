import { useEffect, useState } from 'react';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Pizza', label: '🍕 Pizza' },
  { id: 'Burger', label: '🍔 Burger' },
  { id: 'Biryani', label: '🍲 Biryani' },
  { id: 'Chinese', label: '🥢 Chinese' },
  { id: 'Healthy', label: '🥗 Healthy' },
  { id: 'Dessert', label: '🍰 Dessert' },
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
      
      {/* 1. HERO SECTION (Visual Hook) */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-12 px-4 shadow-lg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Delicious food, <br/> delivered to your door.
          </h1>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Order from your favorite restaurants and track your delivery in real-time.
          </p>
          
          {/* Mobile Search Input */}
          <div className="md:hidden relative max-w-md mx-auto">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search restaurants..."
               className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 font-medium focus:outline-none shadow-xl"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
      </section>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-gray-500 pr-4 border-r border-gray-300 shrink-0">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border shrink-0
                ${activeCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {activeCategory === 'all' ? 'Top Picks For You' : `Best ${activeCategory} Places`}
          </h2>
          <Link to="#" className="text-orange-600 text-sm font-bold flex items-center gap-1 hover:underline">
            See all <ArrowRight size={16} />
          </Link>
        </div>

        {/* The Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[300px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-orange-50 p-6 rounded-full mb-4">
              <Search size={40} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              We couldn't find any matches for "{searchTerm}". Try browsing other categories.
            </p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveCategory("all");}}
              className="mt-6 text-orange-600 font-bold hover:underline"
            >
              Clear all filters
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