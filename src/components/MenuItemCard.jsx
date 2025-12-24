import { Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function MenuItemCard({ item }) {
  const { addToCart, loading } = useCart();

  // Safe Image Fallback
  const imageUrl = item.displayImage || "https://placehold.co/400x300?text=Delicious+Food";
  
  // Veg/Non-Veg Logic (Matches your 'itemType' schema)
  const isVeg = item.itemType === 'veg';
  const badgeColor = isVeg ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600';
  const dotColor = isVeg ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="flex justify-between items-start border-b border-gray-100 py-6 last:border-0 hover:bg-gray-50/50 transition-all p-4 rounded-xl">
      
      {/* LEFT: Item Details */}
      <div className="flex-1 pr-4">
        {/* Veg/Non-Veg Badge */}
        <div className={`w-4 h-4 border ${badgeColor} flex items-center justify-center mb-2 rounded-[4px]`}>
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        </div>

        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.itemName}</h3>
        <span className="font-medium text-gray-900 block mb-2">
          {formatCurrency(item.basePrice)}
        </span>
        
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* RIGHT: Image & Add Button */}
      <div className="relative w-36 h-32 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={item.itemName} 
          className="w-full h-full object-cover rounded-xl shadow-sm"
        />
        
        {/* Floating Add Button */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 shadow-lg">
          <button 
            onClick={() => addToCart({ menuItemId: item._id, quantity: 1 })}
            disabled={loading || !item.isActive}
            className={`
              flex items-center gap-1 bg-white font-bold border border-gray-200 px-8 py-2 rounded-lg text-sm uppercase shadow-sm transition-all
              ${!item.isActive 
                ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-400' 
                : 'text-green-600 hover:bg-green-50 hover:shadow-md'}
            `}
          >
            {!item.isActive ? 'Sold Out' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
}