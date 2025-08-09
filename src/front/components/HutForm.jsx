import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHut } from '../services/hut';
import useGlobalReducer from '../hooks/useGlobalReducer';

const HutForm = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hutData, setHutData] = useState({
    name: '',
    description: '',
    capacity: 2,
    bedrooms: 1,
    bathroom: 1,
    price_per_night: 100,
    location_id: 1,
    image_url: '',
    is_active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHutData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? e.target.checked : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setHutData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newHut = await createHut(hutData);
      console.log('Cabaña creada:', newHut);
      navigate('/huts'); // Redirige al listado
    } catch (err) {
      console.error('Error al crear cabaña:', err);
      setError(err.message || 'Error al crear la cabaña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-green-550 mb-6">Crear Nueva Cabaña</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos del formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={hutData.name}
                onChange={handleChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={hutData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                URL de la imagen *
              </label>
              <input
                type="url"
                name="image_url"
                value={hutData.image_url}
                onChange={handleChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  Capacidad *
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={hutData.capacity}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  Dormitorios *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  min="1"
                  value={hutData.bedrooms}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  Baños *
                </label>
                <input
                  type="number"
                  name="bathroom"
                  min="1"
                  value={hutData.bathroom}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                Precio por noche *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brown-550">$</span>
                <input
                  type="number"
                  name="price_per_night"
                  min="1"
                  step="0.01"
                  value={hutData.price_per_night}
                  onChange={handleNumberChange}
                  className="w-full pl-8 p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                Ubicación (ID) *
              </label>
              <input
                type="number"
                name="location_id"
                min="1"
                value={hutData.location_id}
                onChange={handleNumberChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={hutData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-green-550 focus:ring-green-550 border-brown-200 rounded"
              />
              <label className="ml-2 block text-sm text-brown-550">
                Cabaña activa (disponible para reservas)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/huts')}
            className="px-4 py-2 border border-brown-300 rounded-lg text-brown-550 hover:bg-brown-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-550 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : 'Crear Cabaña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HutForm;