
import React from 'react';

const Sidebar: React.FC = () => {
  const menuOptions = [
    { name: 'داواکارییەکان', icon: '📋' },
    { name: 'مێزەکان', icon: '🪑' },
    { name: 'مەتبەخ', icon: '👨‍🍳' },
    { name: 'ڕاپۆرتەکان', icon: '📊' },
    { name: 'ڕێکخستن', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white border-l h-screen flex flex-col shadow-lg">
      <div className="p-6 border-b text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-orange-400">
          <span className="text-3xl">👤</span>
        </div>
        <h3 className="font-bold text-gray-800">ئەحمەد محەمەد</h3>
        <p className="text-sm text-gray-500">بەڕێوەبەری ستاف</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuOptions.map((option, idx) => (
          <button
            key={idx}
            className={`w-full text-right p-3 rounded-xl flex items-center gap-3 transition-all ${
              idx === 1 ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            <span className="text-xl">{option.icon}</span>
            <span className="font-medium">{option.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button className="w-full text-right p-3 rounded-xl text-red-500 hover:bg-red-50 flex items-center gap-3">
          <span>🚪</span>
          <span className="font-medium">چوونە دەرەوە</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
