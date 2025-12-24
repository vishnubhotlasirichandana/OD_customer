import React from 'react';

export default function CategoryCarousel({ title, items, className = "" }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`py-6 ${className}`}>
      {/* Title */}
      {title && (
        <h2 className="text-xl font-black text-gray-900 mb-4 px-1 tracking-tight">
          {title}
        </h2>
      )}
      
      {/* SCROLL CONTAINER:
         - flex-nowrap: CRITICAL to prevent wrapping (vertical stacking)
         - overflow-x-auto: Enables horizontal scroll
         - scroll-smooth: Nice native feel
      */}
      <div className="flex gap-4 overflow-x-auto flex-nowrap no-scrollbar pb-4 snap-x px-1 scroll-smooth">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-3 min-w-[80px] sm:min-w-[100px] cursor-pointer snap-start flex-shrink-0 group"
          >
            {/* Image Circle */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <img 
                src={item.image} 
                alt={item.label} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Label */}
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center leading-tight group-hover:text-orange-600 transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}