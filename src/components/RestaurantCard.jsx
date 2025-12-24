import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const {
    _id,
    restaurantName = "Unknown Restaurant",
    restaurantMedia,
    cuisineTypes = [],
    rating = "New",
    deliveryTime = "30-45 min",
    address
  } = restaurant;

  // Safe Image Fallback
  const imageUrl = restaurantMedia?.coverImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  // Dynamic Rating Color
  const getRatingColor = (r) => {
    if (r >= 4.0) return "bg-green-600";
    if (r >= 3.0) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Link 
      to={`/restaurant/${_id}`} 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      {/* IMAGE SECTION with Gradient Overlay */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={restaurantName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* Delivery Time Badge on Image */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
          <Clock size={12} /> {deliveryTime}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {restaurantName}
          </h3>
          <span className={`${getRatingColor(rating)} text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm`}>
            {rating} <Star size={10} fill="currentColor" />
          </span>
        </div>

        {/* Cuisine Tags */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-1">
          {cuisineTypes.length > 0 ? cuisineTypes.join(", ") : "Multi-Cuisine"}
        </p>

        {/* Divider */}
        <div className="mt-auto border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="truncate max-w-[100px]">{address?.city || "Nearby"}</span>
          </div>
          <span className="text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
            Free Delivery
          </span>
        </div>
      </div>
    </Link>
  );
}