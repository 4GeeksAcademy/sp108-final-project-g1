import { Map } from '../components/Map';
import { useState } from 'react';



export const MapPage = () => {
  const [huts, setHuts] = useState([]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-150 to-green-350 bg-clip-text text-transparent mb-4">Nuestras Cabañas en el Mapa</h1>
      <div className="h-[70vh] rounded-xl overflow-hidden">
        <Map huts={huts} />
      </div>
    </div>
  );
};