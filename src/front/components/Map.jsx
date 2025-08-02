import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const key_api_maps = import.meta.env.VITE_CLAVE_API_GOOGLE_MAPS
let host = import.meta.env.VITE_BACKEND_URL;

export const Map = () => {
  const [huts, setHuts] = useState([]);
  const [selectedHut, setSelectedHut] = useState(null);
  const [center, setCenter] = useState({ lat: 41.3851, lng: 2.1734 }); // Barcelona por defecto

  const uri = `${host}api/huts/map-data`

  const mapStyles = {
    height: "70vh",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  };

  useEffect(() => {
    const fetchHuts = async () => {
      try {
        const response = await fetch(uri);
        const data = await response.json();
        console.log(data)
        setHuts(data);
        if (data.length > 0) {
          setCenter({
            lat: data[0].position.lat,
            lng: data[0].position.lng
          });
        }
      } catch (error) {
        console.error("Error fetching huts:", error);
      }
    };
    fetchHuts();
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
            position={hut.position}
            onClick={() => setSelectedHut(hut)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/lodging.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}

        {selectedHut && (
          <InfoWindow className="w-64 bg-white rounded-lg overflow-hidden shadow-xl"
            position={selectedHut.position}
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

