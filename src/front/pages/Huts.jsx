import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Register from './Register';
import { getHutsDetail } from '../services/hut';

const Huts = () => {
  const [huts, setHuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHut, setSelectedHut] = useState(null);
 // const [isAuthenticated, setIsAuthenticated] = useState(
  //  localStorage.getItem('token') !== null
  // );

useEffect(() => {
    const hutsList = async () => {
      try {
           setLoading (true)
           setError (null)
        const getHuts = await getHutsDetail();
        if (!getHuts) {
          throw new Error('No se recibieron datos de la cabaña');
        }
        dispatch({ type: "hutsDetail", payload: getHuts })
      setHuts(getHuts);
    }
      catch (err) {
        console.error("Error fetching hut:", err);
        setError({
          message: 'No se pudo cargar la información de las cabañas',
          details: err.message
        });
      }finally {
                setLoading(false);
            }
    }
    hutsList();
  },[]
);

  const handleReserveClick = (hut) => {
    setSelectedHut(hut);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHut(null);
  };

  if (loading) return (
    <div className="text-center mt-8 text-lg text-brown-550">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-550 mx-auto mb-4"
        aria-label="Cargando"
      ></div>
      Cargando cabañas...
    </div>
  );

  if (error) return (
    <div className="text-center mt-8 p-4 max-w-md mx-auto bg-red-50 rounded-lg">
      <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar las cabañas</h3>
      <p className="text-red-500">
        {typeof error === 'string' ? error : 'Ocurrió un error inesperado'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-green-250 text-white rounded hover:bg-green-350 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-550">Nuestras Cabañas</h1>

      {huts.length === 0 ? (
        <div className="text-center text-lg text-brown-550">
          No hay cabañas disponibles
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-green-250 text-white rounded hover:bg-green-350 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {huts.map((hut) => (
            <div key={hut.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={hut.image_url ?? 'https://via.placeholder.com/300x200'}
                alt={`Cabaña ${hut.name ?? 'Sin nombre'}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200';
                  e.target.alt = 'Imagen no disponible';
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-green-550 mb-2">{hut.name ?? 'Cabaña sin nombre'}</h2>
                <p className="text-brown-350 mb-4">{hut.description ?? 'Sin descripción disponible'}</p>
                <ul className="space-y-1 mb-4 text-brown-450">
                  <li>💤 Capacidad: {hut.capacity ?? 'N/A'} personas</li>
                  <li>🛏️ Dormitorios: {hut.bedrooms ?? 'N/A'}</li>
                  <li>🚽 Baños: {hut.bathroom ?? 'N/A'}</li>
                  <li>💰 <span className="font-bold text-green-550">${hut.price_per_night ?? '0'}</span>/noche</li>
                </ul>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/hut/${hut.id}`}
                    className="px-4 py-2 bg-brown-150 text-brown-550 rounded hover:bg-brown-250 transition-colors"
                  >
                    Ver detalles
                  </Link>
    
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedHut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b p-4 bg-green-150">
              <h3 className="text-lg font-bold text-green-550">
                {isAuthenticated ? `Reservar ${selectedHut.name}` : "Regístrate para reservar"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-brown-550 hover:text-brown-350"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {isAuthenticated ? (
                <div>
                  <p className="mb-4">Formulario de reserva para <span className="font-bold">{selectedHut.name}</span></p>
                  <button className="w-full py-2 bg-green-350 text-white rounded hover:bg-green-450">
                    Confirmar Reserva
                  </button>
                </div>
              ) : (
                <Register
                  onSuccess={() => {
                    setIsAuthenticated(true);
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
