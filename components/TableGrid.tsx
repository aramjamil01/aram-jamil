
import React from 'react';

interface TableGridProps {
  selectedTable: number | null;
  onSelectTable: (id: number) => void;
  tableStatuses: Record<number, 'available' | 'occupied'>;
}

const TableGrid: React.FC<TableGridProps> = ({ selectedTable, onSelectTable, tableStatuses }) => {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-r-4 border-orange-500 pr-3">مێزەکان</h2>
      <div className="grid grid-cols-4 gap-4">
        {tables.map((tableId) => {
          const isSelected = selectedTable === tableId;
          const isOccupied = tableStatuses[tableId] === 'occupied';
          
          let buttonClass = "bg-white border-gray-100 text-gray-600 hover:border-orange-300 hover:bg-orange-50";
          if (isSelected) {
            buttonClass = "bg-orange-500 border-orange-600 text-white shadow-lg scale-105";
          } else if (isOccupied) {
            buttonClass = "bg-green-500 border-green-600 text-white shadow-sm";
          }

          return (
            <button
              key={tableId}
              onClick={() => onSelectTable(tableId)}
              className={`h-16 rounded-2xl font-bold text-xl transition-all border-2 ${buttonClass}`}
            >
              {tableId}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-around text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span>دیاریکراو</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
          <span>بەردەست</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>گیراوە</span>
        </div>
      </div>
    </div>
  );
};

export default TableGrid;
