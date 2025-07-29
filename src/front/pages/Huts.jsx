import React from 'react';

export const Huts = () => {
  // Datos de ejemplo 
  const cabañas = [
    {
      id: 1,
      name: "Cabaña del Bosque",
      description: "Acogedora cabaña con vista al bosque y chimenea.",
      capacity: 4,
      bedrooms: 2,
      bathroom: 1,
      price_per_night: 120.00,
      location_id: 1,
      is_active: true,
      image_url: "https://ejemplo.com/cabana1.jpg" 
    },
    // Más cabañas...
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Título */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Cabañas</h1>
        <p className="text-xl text-gray-600">Conecta con la naturaleza en estos refugios únicos.</p>
      </div>

      {/* Lista de cabañas */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {cabañas.map((cabaña) => (
          <div key={cabaña.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen - Usando image_url del modelo */}
            <div className="h-48 sm:h-64 overflow-hidden">
              <img
                src={cabaña.image_url || "https://hips.hearstapps.com/hmg-prod/images/caban-a-disen-o-actual-1535369712.jpg"} 
                alt={`Foto de ${cabaña.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x500?text=Imagen+no+disponible";
                }}
              />
            </div>

            {/* Detalles */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{cabaña.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{cabaña.description}</p>

              {/* Características */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  👥 Capacidad: {cabaña.capacity}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  🛏️ {cabaña.bedrooms} hab.
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  🚿 {cabaña.bathroom} baño(s)
                </span>
              </div>

              {/* Precio  */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">
                  ${cabaña.price_per_night.toFixed(2)} <span className="text-sm font-normal text-gray-500">/noche</span>
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

