import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import { getHutsDetail } from '../services/hut';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from 'react-router-dom';


const key_api_maps = import.meta.env.VITE_CLAVE_API_GOOGLE_MAPS



export const Map = () => {

  const [selectedHut, setSelectedHut] = useState(null);
  const [center, setCenter] = useState({ lat: 41.3851, lng: 2.1734 }); // Barcelona por defecto
  const [mounted, setMounted] = useState (false)


const { store, dispatch } = useGlobalReducer();

const huts = store.hutsDetail

  const mapStyles = {
    height: "70vh",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  
useEffect(() => {
    const getHuts = async () => {
      try {
        const HutsData = await getHutsDetail();
        dispatch({ type: "hutsDetail", payload: HutsData });

      } catch (error) {
        console.error("Error fetching huts:", error);
      }
    };

    getHuts();
    setMounted(true)

  }, []);

  const handleOnClickHut = (item) => {
    setSelectedHut(item)
  }
  if (!mounted) {
    return (<div> Cargando ... </div>)
  }
  return (
      <LoadScript
            googleMapsApiKey={key_api_maps}
            libraries={['places']}
            >
              
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={center}
      >
        {huts.map(hut => (
          <Marker
            key={hut.id}
            position={hut.location_to.position}
            onClick={() => handleOnClickHut(hut)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/lodging.png",
              scaledSize: new google.maps.Size(32, 32),  // Sin 'window.'
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(16, 16)
            }}
          />
        ))}
      

        {selectedHut && (
          <InfoWindow className="w-64 bg-white rounded-lg overflow-hidden shadow-xl"
            position={selectedHut.location_to.position}
            onCloseClick={() => setSelectedHut(null)}
          >
            <div className="p-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 p-3">
          <h3 className="font-bold text-white text-lg">{selectedHut.name}</h3>
        </div>
              <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">${selectedHut.price_per_night}/noche</span>
            {/* <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-sm font-bold text-gray-900">4.8</span>
            </div> */}
          </div>
          </div>
              <img
                src={selectedHut.image_url}
                alt={selectedHut.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <Link
                to={`/huts/${selectedHut.id}`}
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Ver detalles
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
</LoadScript>  
  
  );
};

