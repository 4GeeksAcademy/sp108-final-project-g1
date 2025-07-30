// src/front/pages/Huts.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Register from './Register'; // Importamos el componente Register

const Huts = () => {
  const [huts, setHuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHut, setSelectedHut] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') !== null
  );

  useEffect(() => {
    const fetchHuts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/huts');
        if (!response.ok) throw new Error('Error al cargar cabañas');
        const data = await response.json();
        setHuts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHuts();
  }, []);

  const handleReserveClick = (hut) => {
    setSelectedHut(hut);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHut(null);
  };

  if (loading) return <div className="text-center mt-8 text-lg text-brown-550">Cargando cabañas...</div>;
  if (error) return <div className="text-center mt-8 text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-550">Nuestras Cabañas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {huts.map((hut) => (
          <div key={hut.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img
              src={hut.image_url}
              alt={hut.name}
              className="w-full h-48 object-cover"
              onError={(e) => e.target.src = 'https://via.placeholder.com/300x200'}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-550 mb-2">{hut.name}</h2>
              <p className="text-brown-350 mb-4">{hut.description}</p>
              <ul className="space-y-1 mb-4 text-brown-450">
                <li>💤 Capacidad: {hut.capacity} personas</li>
                <li>🛏️ Dormitorios: {hut.bedrooms}</li>
                <li>🚽 Baños: {hut.bathroom}</li>
                <li>💰 <span className="font-bold text-green-550">${hut.price_per_night}</span>/noche</li>
              </ul>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/hut/${hut.id}`}
                  className="px-4 py-2 bg-brown-150 text-brown-550 rounded hover:bg-brown-250 transition-colors"
                >
                  Ver detalles
                </Link>
                <button
                  onClick={() => handleReserveClick(hut)}
                  className="px-4 py-2 bg-green-250 text-white rounded hover:bg-green-350 transition-colors"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Reserva/Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b p-4 bg-green-150">
              <h3 className="text-lg font-bold text-green-550">
                {isAuthenticated ? `Reservar ${selectedHut.name}` : "Regístrate para reservar"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-brown-550 hover:text-brown-350"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {isAuthenticated ? (
                <div>
                  <p className="mb-4">Formulario de reserva para <span className="font-bold">{selectedHut.name}</span></p>
                  {/* Aquí iría el formulario de reserva */}
                  <button className="w-full py-2 bg-green-350 text-white rounded hover:bg-green-450">
                    Confirmar Reserva
                  </button>
                </div>
              ) : (
                <Register
                  onSuccess={() => {
                    setIsAuthenticated(true);
                    // Aquí podrías cambiar automáticamente a mostrar el formulario de reserva
                  }}
                  hutName={selectedHut.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Huts;