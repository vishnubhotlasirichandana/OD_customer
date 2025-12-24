import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import MenuItemCard from '../components/MenuItemCard';
import { Star, Clock, MapPin, Search, ChevronLeft, Heart, Share2 } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'veg', 'non-veg'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Restaurant Info & Menu in Parallel
        const [restRes, menuRes] = await Promise.all([
          client.get(`/restaurants/${id}`),
          client.get(`/menuItems/restaurant/${id}`) // Matches backend route
        ]);
        setRestaurant(restRes.data.data);
        setMenu(menuRes.data.data || []);
      } catch (err) {
        console.error("Failed to load restaurant data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- FILTER LOGIC ---
  const categories = useMemo(() => {
    // 1. Filter items first
    const filteredItems = menu.filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.itemType === filterType;
      return matchesSearch && matchesType;
    });

    // 2. Group by Category
    const grouped = {};
    filteredItems.forEach(item => {
      const catName = item.category || "Main Course";
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(item);
    });
    
    return grouped;
  }, [menu, searchTerm, filterType]);


  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      <p className="text-gray-500 font-medium">Loading Menu...</p>
    </div>
  );

  if (!restaurant) return <div className="p-10 text-center text-xl">Restaurant not found 😔</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 1. RESTAURANT HEADER */}
      <div className="bg-white pb-6 pt-4 px-4 shadow-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Nav & Actions */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="text-gray-500 hover:text-orange-600 flex items-center gap-1 text-sm font-medium transition-colors">
              <ChevronLeft size={18} /> Back
            </Link>
            <div className="flex gap-3">
               <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                 <Heart size={20} />
               </button>
               <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                 <Share2 size={20} />
               </button>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {restaurant.restaurantName}
              </h1>
              <p className="text-gray-500 text-base mb-3 font-medium">
                {restaurant.cuisineTypes.join(", ")}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <MapPin size={14} /> {restaurant.address.city}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Clock size={14} /> {restaurant.deliveryTime || '35 mins'}
                </span>
              </div>
            </div>
            
            {/* Rating Box */}
            <div className="flex flex-col items-center bg-green-50 border border-green-100 p-3 rounded-xl min-w-[100px]">
               <span className="flex items-center gap-1 text-green-700 font-black text-2xl">
                {restaurant.rating || '4.2'} <Star size={18} fill="currentColor" />
              </span>
              <span className="text-xs text-green-600 font-bold uppercase tracking-wider">
                Very Good
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-0 bg-white shadow-md z-30 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
           
           {/* Search Input */}
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search for dishes (e.g. Paneer)..." 
                className="pl-12 pr-4 py-2.5 bg-gray-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 w-full transition-shadow"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           
           {/* Veg Toggle Switches */}
           <div className="flex gap-3">
              <button 
                onClick={() => setFilterType(filterType === 'veg' ? 'all' : 'veg')}
                className={`px-4 py-2 text-xs font-bold border rounded-full transition-all flex items-center gap-2 ${
                  filterType === 'veg' 
                  ? 'bg-green-50 border-green-600 text-green-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${filterType === 'veg' ? 'bg-green-600' : 'bg-gray-300'}`} />
                Pure Veg
              </button>
              <button 
                 onClick={() => setFilterType(filterType === 'non-veg' ? 'all' : 'non-veg')}
                 className={`px-4 py-2 text-xs font-bold border rounded-full transition-all flex items-center gap-2 ${
                  filterType === 'non-veg' 
                  ? 'bg-red-50 border-red-600 text-red-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                 }`}
              >
                <div className={`w-2 h-2 rounded-full ${filterType === 'non-veg' ? 'bg-red-600' : 'bg-gray-300'}`} />
                Non-Veg
              </button>
           </div>
        </div>
      </div>

      {/* 3. MENU CATEGORIES LIST */}
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {Object.keys(categories).length === 0 ? (
           <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
             <div className="text-4xl mb-4">🥗</div>
             <h3 className="text-lg font-bold text-gray-800">No dishes found</h3>
             <p className="text-gray-400 mt-1">Try adjusting your filters or search term.</p>
             <button 
                onClick={() => {setSearchTerm(""); setFilterType("all");}}
                className="mt-4 text-orange-600 font-bold text-sm hover:underline"
             >
               Clear Filters
             </button>
           </div>
        ) : (
          Object.entries(categories).map(([categoryName, items]) => (
            <div key={categoryName} className="scroll-mt-32"> {/* Scroll offset for sticky header */}
              
              {/* Category Heading */}
              <div className="flex items-center justify-between mb-4 px-2">
                 <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
                    {categoryName} <span className="text-gray-400 text-lg font-medium ml-1">({items.length})</span>
                 </h2>
              </div>
              
              {/* Items Card List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {items.map(item => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}