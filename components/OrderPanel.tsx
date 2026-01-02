
import React, { useState } from 'react';
import { OrderItem } from '../types';

interface OrderPanelProps {
  selectedTable: number | null;
  orderItems: OrderItem[];
  onRemoveItem: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onSendOrder: () => void;
  aiSuggestion: string | null;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ 
  selectedTable, 
  orderItems, 
  onRemoveItem,
  onUpdateNote,
  onSendOrder,
  aiSuggestion 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const toggleEdit = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  return (
    <div className="bg-white w-96 border-r flex flex-col h-screen shadow-2xl relative z-10">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">داواکاری نوێ</h2>
          {selectedTable && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
              مێزی #{selectedTable}
            </span>
          )}
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>ژمارەی خواردنەکان: {orderItems.length}</span>
          <span>{new Date().toLocaleTimeString('ku-IQ')}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
            <span className="text-6xl mb-4">🛒</span>
            <p>هیچ داواکارییەک نییە</p>
          </div>
        ) : (
          orderItems.map((item) => (
            <div key={item.id} className="flex flex-col bg-orange-50 rounded-2xl p-3 animate-in slide-in-from-right-2 overflow-hidden transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="bg-red-100 text-red-500 p-1 h-6 w-6 flex items-center justify-center rounded-full hover:bg-red-200 transition-colors"
                      title="سڕینەوە"
                    >
                      ✕
                    </button>
                    <button 
                      onClick={() => toggleEdit(item.id)}
                      className={`p-1 h-6 w-6 flex items-center justify-center rounded-full transition-colors ${editingId === item.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      title="دەستکاری"
                    >
                      ✏️
                    </button>
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-orange-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.price.toLocaleString()} د.ک</p>
                    {item.note && !editingId && (
                      <p className="text-[10px] text-orange-600 bg-white/50 px-1 rounded mt-0.5 inline-block">📝 {item.note}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-orange-600">x{item.quantity}</span>
                  <span className="text-xs font-medium">{(item.price * item.quantity).toLocaleString()} د.ک</span>
                </div>
              </div>

              {/* Edit Note Field */}
              <div className={`overflow-hidden transition-all duration-300 ${editingId === item.id ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                <input 
                  type="text"
                  placeholder="تێبینی خواردن... (بۆ نموونە: بێ پیاز)"
                  value={item.note || ''}
                  onChange={(e) => onUpdateNote(item.id, e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  autoFocus
                />
              </div>
            </div>
          ))
        )}
      </div>

      {aiSuggestion && orderItems.length > 0 && (
        <div className="m-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
          <span className="font-bold block mb-1">✨ پێشنیاری ژیری دەستکرد:</span>
          {aiSuggestion}
        </div>
      )}

      <div className="p-6 bg-gray-50 border-t space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>کۆی گشتی</span>
            <span>{total.toLocaleString()} د.ک</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>باج (٠٪)</span>
            <span>٠ د.ک</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xl font-bold text-gray-800">کۆتایی</span>
            <span className="text-2xl font-black text-orange-600">{total.toLocaleString()} د.ک</span>
          </div>
        </div>

        <button
          onClick={onSendOrder}
          disabled={orderItems.length === 0 || !selectedTable}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 text-lg"
        >
          ناردنی داواکاری
        </button>
      </div>
    </div>
  );
};

export default OrderPanel;
