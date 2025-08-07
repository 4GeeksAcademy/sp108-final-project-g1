import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getHutsDetail } from '../services/hut';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useJsApiLoader } from '@react-google-maps/api';

const key_api_maps = import.meta.env.VITE_CLAVE_API_GOOGLE_MAPS;

export const Map = () => {
  const [selectedHut, setSelectedHut] = useState(null);
  const [center, setCenter] = useState({ lat: 41.3851, lng: 2.1734 });
  const [loadingHuts, setLoadingHuts] = useState(true);
  const [error, setError] = useState(null);
  
  const { store, dispatch } = useGlobalReducer();
  const huts = store.hutsDetail || [];

  // Usar useJsApiLoader en lugar de LoadScript
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: key_api_maps,
    libraries: ['places'],
  });

  const mapStyles = {
    height: "70vh",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  useEffect(() => {
    const getHuts = async () => {
      try {
        const hutsData = await getHutsDetail();
        dispatch({ type: "hutsDetail", payload: hutsData });
        
        if (hutsData?.length > 0 && hutsData[0].location_to?.position) {
          setCenter(hutsData[0].location_to.position);
        }
      } catch (error) {
        console.error("Error fetching huts:", error);
        setError("Error al cargar las cabañas");
      } finally {
        setLoadingHuts(false);
      }
    };
    
    getHuts();
  }, [dispatch]);

  if (!isLoaded || loadingHuts) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={10}
      center={center}
    >
      {huts.map(hut => (
        hut.location_to?.position && (
          <Marker
            key={hut.id}
            position={hut.location_to.position}
            onClick={() => setSelectedHut(hut)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/lodging.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        )
      ))}

      {selectedHut && selectedHut.location_to?.position && (
        <InfoWindow
          position={selectedHut.location_to.position}
          onCloseClick={() => setSelectedHut(null)}
        >
          <div className="p-2 w-64">
            <h3 className="font-bold text-lg">{selectedHut.name}</h3>
            <p className="text-gray-700">${selectedHut.price} por noche</p>
            {selectedHut.image_url && (
              <img
                src={selectedHut.image_url}
                alt={selectedHut.name}
                className="w-full h-32 object-cover mt-2 rounded"
              />
            )}
            <a
              href={`/huts/${selectedHut.id}`}
              className="inline-block mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Ver detalles
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};