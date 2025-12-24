import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import debounce from 'lodash.debounce';

export default function Restaurants() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = async (currentPage, type, search, append = false) => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
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

  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      fetchRestaurants(1, initialType, query, false);
    }, 500),
    [initialType]
  );

  useEffect(() => {
    setPage(1);
    fetchRestaurants(1, initialType, searchTerm, false);
  }, [initialType]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const formatTitle = (t) => {
    if (t === 'food_delivery') return 'Food Delivery';
    if (t === 'food_delivery_and_dining') return 'Dining Out';
    if (t === 'groceries') return 'Groceries';
    return 'All Restaurants';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {formatTitle(initialType)}
            </h1>
            <p className="text-gray-500 mt-1">Best places near London, UK</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={`Search ${formatTitle(initialType)}...`}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Grid */}
        {loading && page === 1 ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={40}/></div>
        ) : restaurants.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
             <h3 className="text-xl font-bold">No matches found</h3>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && page < totalPages && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchRestaurants(nextPage, initialType, searchTerm, true);
                }}
                className="px-8 py-3 bg-white border border-gray-300 font-bold text-gray-700 rounded-full hover:shadow-md transition-all"
              >
                Load More
              </button>
            </div>
        )}
      </div>
    </div>
  );
}