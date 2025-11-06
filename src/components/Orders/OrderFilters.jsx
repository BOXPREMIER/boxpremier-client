import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import Button from '../../components/Button';

const OrderFilters = ({ onApplyFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
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
            status: "all",
            date: ""
        };
        setFilters(clearedFilters);
        onApplyFilters(clearedFilters);
    };

    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Buscar por ID, cliente o email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                    />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
                <Button
                    title="Aplicar"
                    action={handleApply}
                />
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="preparing">Preparando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderFilters;
