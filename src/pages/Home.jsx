import { useEffect, useState, useCallback } from 'react';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import debounce from 'lodash.debounce'; // Run: npm install lodash.debounce

// Filters match your Backend Schema enum: ['food_delivery_and_dining', 'groceries', 'food_delivery']
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'food_delivery', label: 'Delivery' },
  { id: 'food_delivery_and_dining', label: 'Dining' },
  { id: 'groceries', label: 'Groceries' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Core Fetch Function
  const fetchRestaurants = async (currentPage, type, search, append = false) => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
      
      // Only append valid filters supported by backend
      if (type !== 'all') params.type = type;
      if (search) params.search = search;

      const { data } = await client.get('/restaurants', { params });
      
      if (data.success) {
        setRestaurants(prev => append ? [...prev, ...data.data] : data.data);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced Search Handler to prevent API spam
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1); // Reset to page 1 on new search
      fetchRestaurants(1, activeType, query, false);
    }, 500),
    [activeType]
  );

  // Initial Load & Filter Change
  useEffect(() => {
    setPage(1);
    fetchRestaurants(1, activeType, searchTerm, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearch(val);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRestaurants(nextPage, activeType, searchTerm, true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. HEADER & SEARCH */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by restaurant name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1">
             <div className="flex items-center gap-2 text-gray-500 pr-2 border-r border-gray-200 shrink-0">
               <SlidersHorizontal size={18} />
             </div>
             {FILTERS.map(f => (
               <button
                 key={f.id}
                 onClick={() => setActiveType(f.id)}
                 className={`
                   px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all
                   ${activeType === f.id 
                     ? 'bg-gray-900 text-white border-gray-900' 
                     : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
                 `}
               >
                 {f.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* 2. GRID CONTENT */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {restaurants.length === 0 && !loading ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-900">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}

        {/* 3. LOAD MORE / LOADING STATE */}
        <div className="mt-12 text-center">
          {loading && <Loader2 className="animate-spin mx-auto text-orange-600" size={32} />}
          
          {!loading && page < totalPages && (
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border border-gray-300 font-bold text-gray-700 rounded-full hover:bg-gray-50 hover:shadow-md transition-all"
            >
              Load More Restaurants
            </button>
          )}
        </div>
      </div>
    </div>
  );
}