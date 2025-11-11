import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const PaymentFilters = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: "",
      date: ""
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Barra de búsqueda */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Buscar por ID, cliente o email..."
              value={filters.search}
              onChange={handleChange}
              onKeyPress={(e) => e.key === 'Enter' && handleApply()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Más filtros"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* Filtros adicionales */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Limpiar filtros
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFilters;