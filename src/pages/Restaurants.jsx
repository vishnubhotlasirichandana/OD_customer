import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCarousel from '../components/CategoryCarousel';
import { Search, Loader2, ArrowLeft, Filter } from 'lucide-react';
import debounce from 'lodash.debounce';

// --- STATIC DATA (Curated for visibility) ---
const FOOD_CATEGORIES = [
  { label: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop' },
  { label: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
  { label: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { label: 'Rolls', image: 'https://images.unsplash.com/photo-1541592393-2b9921b2d49c?w=200&h=200&fit=crop' },
  { label: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop' },
  { label: 'Dessert', image: 'https://images.unsplash.com/photo-1563729768-3980d7c74d29?w=200&h=200&fit=crop' },
  { label: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=200&h=200&fit=crop' },
  { label: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e7?w=200&h=200&fit=crop' },
];

const GROCERY_CATEGORIES = [
  { label: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=200&h=200&fit=crop' },
  { label: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop' },
  { label: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop' },
  { label: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop' },
  { label: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-28b12e81658b?w=200&h=200&fit=crop' },
  { label: 'Care', image: 'https://images.unsplash.com/photo-1556228720-1957be982260?w=200&h=200&fit=crop' },
];

const DINING_CATEGORIES = [
  { label: 'Fine Dining', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=200&h=200&fit=crop' },
  { label: 'Pubs', image: 'https://images.unsplash.com/photo-1572116469696-9587215f2faa?w=200&h=200&fit=crop' },
  { label: 'Cafes', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop' },
  { label: 'Buffet', image: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=200&h=200&fit=crop' },
];

export default function Restaurants() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentType = searchParams.get('type') || 'food_delivery';

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = async (currentPage, type, search, append = false) => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
      
      if (search) params.search = search;

      if (type === 'food_delivery_and_dining') {
        params.acceptsDining = true;
      } else {
        params.type = type;
      }

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
      fetchRestaurants(1, currentType, query, false);
    }, 500),
    [currentType]
  );

  useEffect(() => {
    setPage(1);
    fetchRestaurants(1, currentType, searchTerm, false);
  }, [currentType]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  // --- CONFIGURATION LOGIC (Fixes Duplication) ---
  const getViewConfig = () => {
    switch (currentType) {
      case 'groceries':
        return {
          title: 'Grocery Delivery',
          placeholder: 'Search for daily essentials...',
          categoriesTitle: 'Shop By Category', // Single Category Title
          categories: GROCERY_CATEGORIES,      // Single Category List
          gridTitle: 'Stores Near You'
        };
      case 'food_delivery_and_dining':
        return {
          title: 'Eat Out',
          placeholder: 'Search for dining restaurants...',
          categoriesTitle: 'Dining Options',
          categories: DINING_CATEGORIES,
          gridTitle: 'Book a Table'
        };
      default: // food_delivery
        return {
          title: 'Food Delivery',
          placeholder: 'Search for food or restaurants...',
          categoriesTitle: "What's on your mind?",
          categories: FOOD_CATEGORIES,
          gridTitle: 'Restaurants with Online Delivery'
        };
    }
  };

  const config = getViewConfig();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER & NAV */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
            {config.title}
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={config.placeholder}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* SECTION 1: Carousel (Rendered ONCE) */}
        {config.categories && (
           <CategoryCarousel title={config.categoriesTitle} items={config.categories} />
        )}

        {/* SECTION 2: Restaurant Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-black text-gray-900 mb-6">{config.gridTitle}</h2>
          
          {loading && page === 1 ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={40}/></div>
          ) : restaurants.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
               <h3 className="text-xl font-bold text-gray-800">No matches found</h3>
               <p className="text-gray-500">Try changing your search term.</p>
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
                    fetchRestaurants(nextPage, currentType, searchTerm, true);
                  }}
                  className="px-8 py-3 bg-white border border-gray-300 font-bold text-gray-700 rounded-full hover:shadow-md transition-all"
                >
                  Load More
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}