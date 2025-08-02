import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export const SearchBar = ({ huts, onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // Maneja cambios en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  // Maneja cambios en el filtro de precio
  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
    onFilter({ priceRange: newPriceRange });
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
        {/* Campo de búsqueda */}
        <div className="flex items-center px-4 py-2 flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar cabañas por nombre..."
            className="w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Botón de filtros */}
        <button
          className="px-4 py-2 bg-blue-500 text-white flex items-center hover:bg-blue-600 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="h-5 w-5 mr-1" />
          Filtros
        </button>
      </div>

      {/* Panel de filtros desplegable */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold mb-3">Filtrar por precio</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full"
              />
              <span className="text-sm text-gray-600">${priceRange[0]}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full"
              />
              <span className="text-sm text-gray-600">${priceRange[1]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};