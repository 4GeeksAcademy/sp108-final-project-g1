import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import { getHutsDetail } from '../services/hut';
import useGlobalReducer from "../hooks/useGlobalReducer";


const key_api_maps = import.meta.env.VITE_CLAVE_API_GOOGLE_MAPS



export const Map = () => {

  const [selectedHut, setSelectedHut] = useState(null);
  const [center, setCenter] = useState({ lat: 41.3851, lng: 2.1734 }); // Barcelona por defecto

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

  }, []);

  return (
    <LoadScript className="relative w-full h-full rounded-xl overflow-hidden shadow-lg"
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
            onClick={() => setSelectedHut(hut)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/lodging.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}
      

        {selectedHut && (
          <InfoWindow className="w-64 bg-white rounded-lg overflow-hidden shadow-xl"
            position={selectedHut.location_to.position}
            onCloseClick={() => setSelectedHut(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedHut.name}</h3>
              <p>${selectedHut.price} por noche</p>
              <img
                src={selectedHut.image_url}
                alt={selectedHut.name}
                className="w-20 h-20 object-cover mt-2"
              />
              <a
                href={`/huts/${selectedHut.id}`}
                className="text-blue-500 hover:underline block mt-2"
              >
                Ver detalles
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

