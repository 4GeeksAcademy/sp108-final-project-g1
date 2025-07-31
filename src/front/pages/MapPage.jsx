import {Map} from '../components/Map';
import { useState } from 'react';



export const MapPage = () => {
  const [huts, setHuts] = useState([]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestras Cabañas en el Mapa</h1>
      <div className="h-[70vh] rounded-xl overflow-hidden">
        <Map huts={huts} />
      </div>
    </div>
  );
};