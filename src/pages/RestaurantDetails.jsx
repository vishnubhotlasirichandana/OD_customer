import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import MenuItemCard from '../components/MenuItemCard';
import { Star, Clock, MapPin, Search, ChevronLeft, Info, Utensils } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local State
  const [menuSearch, setMenuSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, menuRes] = await Promise.all([
          client.get(`/restaurants/${id}`),
          // UPDATED: Endpoint changed to match backend route '/api/menu-items/...'
          client.get(`/menu-items/restaurant/${id}?isAvailable=true`)
        ]);

        if (restRes.data.success) setRestaurant(restRes.data.data);
        if (menuRes.data.success) setMenu(menuRes.data.data || []);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Could not load restaurant details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Safe Formatters
  const formatType = (type) => type ? type.replace(/_/g, ' ').toUpperCase() : 'RESTAURANT';
  const getCity = (addr) => addr?.city || "London, UK"; 

  // Grouping Logic
  const groupedMenu = useMemo(() => {
    if (!menu.length) return {};

    const filtered = menu.filter(item => {
      const matchesSearch = item.itemName.toLowerCase().includes(menuSearch.toLowerCase());
      const matchesType = activeFilter === 'all' || item.itemType === activeFilter;
      return matchesSearch && matchesType;
    });

    const groups = {};
    filtered.forEach(item => {
      const itemCategories = item.categories?.length > 0 ? item.categories : [{ categoryName: 'Mains' }];
      itemCategories.forEach(cat => {
        const catName = cat.categoryName || 'Mains';
        if (!groups[catName]) groups[catName] = [];
        if (!groups[catName].find(i => i._id === item._id)) groups[catName].push(item);
      });
    });
    return groups;
  }, [menu, menuSearch, activeFilter]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div></div>;

  if (error || !restaurant) return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <Info size={48} className="text-gray-300 mb-4" />
      <h2 className="text-xl font-bold">Restaurant not found</h2>
      <Link to="/" className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full font-bold">Back Home</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-orange-600 mb-6 uppercase tracking-wide">
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{restaurant.restaurantName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><Utensils size={12} className="inline mr-1"/>{formatType(restaurant.restaurantType)}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {getCity(restaurant.address)}</span>
              </div>
            </div>
            <div className="bg-white border p-3 rounded-xl shadow-sm text-center min-w-[80px]">
              <span className="flex items-center justify-center gap-1 text-green-700 font-black text-xl">4.2 <Star size={16} fill="currentColor" /></span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 md:top-20 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search menu..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" value={menuSearch} onChange={e => setMenuSearch(e.target.value)} />
           </div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {['all', 'veg', 'non-veg', 'egg'].map(type => (
                <button key={type} onClick={() => setActiveFilter(type)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border whitespace-nowrap ${activeFilter === type ? 'bg-gray-900 text-white' : 'bg-white text-gray-500'}`}>{type}</button>
              ))}
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-10">
        {Object.keys(groupedMenu).length === 0 ? <div className="text-center py-20 text-gray-500">No items found</div> : 
          Object.entries(groupedMenu).map(([cat, items]) => (
            <div key={cat} className="scroll-mt-36">
              <h3 className="text-lg font-black text-gray-900 mb-4">{cat} ({items.length})</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">{items.map(item => <MenuItemCard key={item._id} item={item} />)}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}