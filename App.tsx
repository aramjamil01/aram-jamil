
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TableGrid from './components/TableGrid';
import OrderPanel from './components/OrderPanel';
import { MENU_ITEMS, CATEGORIES } from './constants';
import { MenuItem, OrderItem } from './types';
import { getSmartSuggestion } from './services/geminiService';

const App: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableStatuses, setTableStatuses] = useState<Record<number, 'available' | 'occupied'>>(
    Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, 'available']))
  );
  const [selectedCategory, setSelectedCategory] = useState('هەمووی');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Combined filtering logic for categories and search query
  const filteredItems = MENU_ITEMS.filter(item => {
    const categoryMatch = selectedCategory === 'هەمووی' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleAddItem = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItemNote = (id: string, note: string) => {
    setOrderItems(prev => prev.map(item => item.id === id ? { ...item, note } : item));
  };

  const handleSendOrder = () => {
    if (selectedTable) {
      setTableStatuses(prev => ({
        ...prev,
        [selectedTable]: 'occupied'
      }));
      alert(`داواکاری بۆ مێزی ${selectedTable} بە سەرکەوتوویی نێردرا!`);
      setOrderItems([]);
      setSelectedTable(null);
      setAiSuggestion(null);
    }
  };

  useEffect(() => {
    if (orderItems.length > 0) {
      const names = orderItems.map(i => i.name);
      const timer = setTimeout(async () => {
        const suggestion = await getSmartSuggestion(names);
        setAiSuggestion(suggestion);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAiSuggestion(null);
    }
  }, [orderItems]);

  return (
    <div className="flex h-screen bg-gray-50 text-right">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-orange-600">چێشتخانەی ڕێبوار</h1>
            <div className="h-6 w-px bg-gray-200"></div>
            <p className="text-gray-500 font-medium hidden lg:block">بەخێربێن بۆ سیستەمی نوێی بەڕێوەبردن</p>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              <input 
                type="text"
                placeholder="گەڕان بۆ خواردن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent rounded-2xl py-2.5 pr-12 pl-4 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-gray-700 font-medium"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-700">سیستەم چالاکە</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex p-6 gap-6 overflow-hidden">
          
          {/* Middle Menu Section */}
          <div className="flex-[3] flex flex-col gap-6 overflow-hidden">
            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-1 content-start">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="bg-white rounded-3xl p-4 shadow-sm border border-transparent hover:border-orange-300 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden h-fit"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-orange-600 font-black">{item.price.toLocaleString()} د.ک</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      ➕
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                  <span className="text-6xl mb-4">🔎</span>
                  <p className="text-xl font-bold">هیچ ئەنجامێک نەدۆزرایەوە بۆ "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="flex-1 max-w-xs space-y-6">
            <TableGrid 
              selectedTable={selectedTable} 
              onSelectTable={setSelectedTable} 
              tableStatuses={tableStatuses}
            />
            
            <div className="bg-orange-500 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">ئۆفەری تایبەت 🎁</h4>
                <p className="text-sm opacity-90">داواکاری سەروو ٥٠ هەزار داشکاندنی ١٠٪ لەخۆ دەگرێت</p>
              </div>
              <div className="absolute -bottom-6 -right-6 text-8xl opacity-20 transform rotate-12">
                🏷️
              </div>
            </div>
          </div>

        </div>
      </main>

      <OrderPanel 
        selectedTable={selectedTable} 
        orderItems={orderItems} 
        onRemoveItem={handleRemoveItem}
        onUpdateNote={handleUpdateItemNote}
        onSendOrder={handleSendOrder}
        aiSuggestion={aiSuggestion}
      />
    </div>
  );
};

export default App;
