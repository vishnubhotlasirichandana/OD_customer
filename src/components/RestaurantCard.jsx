import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency'; // Assuming you have this, or use a simple helper

export default function RestaurantCard({ restaurant }) {
  const {
    _id,
    restaurantName = "Unknown Restaurant",
    restaurantMedia,
    cuisineTypes = [],
    rating = "New",
    deliveryTime = "35-45 min",
    priceForTwo = 300,
    address
  } = restaurant;

  const imageUrl = restaurantMedia?.coverImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  // Rating Badge Logic
  const getRatingStyle = (r) => {
    const num = parseFloat(r);
    if (isNaN(num)) return "bg-blue-500 text-white"; // For "New"
    if (num >= 4.0) return "bg-green-600 text-white";
    if (num >= 3.0) return "bg-yellow-500 text-black";
    return "bg-orange-500 text-white";
  };

  return (
    <Link 
      to={`/restaurant/${_id}`} 
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* 1. Image Section */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={restaurantName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Promoted / Discount Badge could go here */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm">
          {deliveryTime}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurantName}
          </h3>
          <span className={`${getRatingStyle(rating)} text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0`}>
            {rating} <Star size={10} fill="currentColor" />
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm font-medium line-clamp-1">
             {cuisineTypes.join(", ")}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {address?.city || "Nearby"} • {formatCurrency(priceForTwo)} for two
          </p>
        </div>

        {/* Divider */}
        <div className="mt-auto border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Free Delivery
          </span>
          <button className="text-xs font-bold text-gray-400 group-hover:text-orange-600 uppercase tracking-wide transition-colors">
            View Menu →
          </button>
        </div>
      </div>
    </Link>
  );
}