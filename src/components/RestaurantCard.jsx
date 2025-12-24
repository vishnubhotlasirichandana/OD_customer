import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const {
    _id,
    restaurantName = "Unknown Spot",
    restaurantMedia,
    cuisineTypes = [],
    rating = "New",
    deliveryTime = "35 mins",
    address
  } = restaurant;

  const imageUrl = restaurantMedia?.coverImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  // Dynamic Rating Badge
  const getRatingStyle = (r) => {
    if (r === "New") return "bg-blue-500 text-white";
    if (r >= 4.0) return "bg-green-600 text-white";
    return "bg-yellow-500 text-black";
  };

  return (
    <Link 
      to={`/restaurant/${_id}`} 
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={restaurantName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        
        {/* Overlay Data */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
            <Clock size={12} /> {deliveryTime}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {restaurantName}
          </h3>
          <span className={`${getRatingStyle(rating)} text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0`}>
            {rating} <Star size={8} fill="currentColor" />
          </span>
        </div>

        <p className="text-gray-500 text-sm font-medium mb-4 line-clamp-1">
          {cuisineTypes.slice(0, 3).join(", ")}
        </p>

        <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate max-w-[120px]">{address?.city || "Nearby"}</span>
          </div>
          <span className="text-primary font-bold bg-orange-50 px-2 py-0.5 rounded-full">
            Free Delivery
          </span>
        </div>
      </div>
    </Link>
  );
}