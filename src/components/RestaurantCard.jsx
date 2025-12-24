import { Link } from 'react-router-dom';
import { MapPin, Bike } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  // Destructure safe defaults based on your Mongoose Schema
  const {
    _id,
    restaurantName = "Unknown",
    restaurantType,
    address,
    deliverySettings,
    handlingChargesPercentage
  } = restaurant;

  // Formatting Helper
  const formatType = (type) => {
    if (!type) return "";
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Safe Image Fallback (Since backend doesn't join images yet)
  // You can rotate these or use a generic one
  const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80";

  return (
    <Link 
      to={`/restaurant/${_id}`} 
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* 1. Image Area */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-200">
        <img 
          src={PLACEHOLDER_IMG} 
          alt={restaurantName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Delivery Radius Badge */}
        {deliverySettings?.freeDeliveryRadius > 0 && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Free del. up to {deliverySettings.freeDeliveryRadius} miles
          </div>
        )}
      </div>

      {/* 2. Details Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
            {restaurantName}
          </h3>
          {/* Since no rating in schema, we show 'New' or nothing */}
          <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            {formatType(restaurantType).split(' ')[0]} {/* e.g. 'Food' or 'Groceries' */}
          </span>
        </div>

        <div className="text-gray-500 text-sm space-y-1 mb-4">
          <p className="flex items-center gap-1.5 truncate">
             <MapPin size={14} className="shrink-0" />
             {address?.city || "Unknown City"}, {address?.area || "Area"}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
             <Bike size={14} className="shrink-0" />
             {deliverySettings?.maxDeliveryRadius ? `Delivers up to ${deliverySettings.maxDeliveryRadius} miles` : 'Delivery Available'}
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-auto border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-xs font-medium text-gray-400">
          <span>
            {handlingChargesPercentage > 0 ? `${handlingChargesPercentage}% Handling Fee` : 'No Handling Fee'}
          </span>
        </div>
      </div>
    </Link>
  );
}