import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Utensils, Truck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleExplore = (type) => {
    // Navigate to a listing page with the correct filter
    // We will reuse the same 'restaurants' route but with query params
    navigate(`/restaurants?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gray-900 text-white py-20 px-4 overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Order. Eat. <span className="text-orange-500">Repeat.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Your favorite restaurants and groceries, delivered to your door or ready for dining out.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Food Delivery */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck size={40} className="text-orange-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Food Delivery</h2>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Order form your favorite restaurants and get it delivered fast.
            </p>
            <button 
              onClick={() => handleExplore('food_delivery')}
              className="mt-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2 group-hover:gap-3"
            >
              Explore Now <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Eat Out (Dining) */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Utensils size={40} className="text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Eat Out</h2>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Book a table and enjoy dining at the best places in town.
            </p>
            <button 
              onClick={() => handleExplore('food_delivery_and_dining')}
              className="mt-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 group-hover:gap-3"
            >
              Explore Now <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 3: Groceries */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Groceries</h2>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Daily essentials and fresh produce delivered in minutes.
            </p>
            <button 
              onClick={() => handleExplore('groceries')}
              className="mt-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 group-hover:gap-3"
            >
              Explore Now <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}