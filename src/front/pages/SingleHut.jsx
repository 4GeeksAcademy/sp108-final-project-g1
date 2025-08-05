import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSigleHuts } from '../services/singleHut';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { FavoriteButton } from '../components/FavoriteButton';

export const SingleHut = () => {
    const { id } = useParams();
    const [hut, setHut] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const fetchHutData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Primero verifica si la cabaña ya está en el store
                const hutFromStore = store.hutsDetail.find(h => h.id === parseInt(id));

                if (hutFromStore) {
                    setHut(hutFromStore);
                    setLoading(false);
                    return;
                }

                // Si no está en el store, hace fetch al backend
                const hutData = await getSigleHuts(id);

                if (!hutData) {
                    throw new Error('No se recibieron datos de la cabaña');
                }

                // Actualiza el store con los nuevos datos
                dispatch({
                    type: 'hutsDetail',
                    payload: [...store.hutsDetail, hutData]
                });

                setHut(hutData);
            } catch (err) {
                console.error("Error fetching hut:", err);
                setError({
                    message: 'No se pudo cargar la información de la cabaña',
                    details: err.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHutData();
    }, [id, store.hutsDetail, dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <h3 className="font-bold">Error</h3>
                    <p>{error.message}</p>
                    {error.details && (
                        <p className="text-sm mt-2">{error.details}</p>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!hut) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <p>No se encontró la cabaña solicitada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brown-150">
                {/* Imagen principal - Responsiva */}
                <div className="h-48 w-full md:w-auto md:max-w-full md:h-auto md:aspect-video overflow-hidden relative">
                    <img
                        src={hut.image_url}
                        alt={hut.name}
                        className="w-full h-full md:h-auto md:w-full object-cover md:object-contain"
                    />
                </div>

                {/* Contenido */}
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-green-550">{hut.name}</h1>
                            <p className="text-green-450 text-sm md:text-base">
                                {hut.location_to?.city}, {hut.location_to?.region}
                            </p>

                        </div>
                        <div className="text-right">
                            <span className="text-lg md:text-xl font-semibold text-brown-550">${hut.price_per_night}</span>
                            <span className="text-brown-350 text-sm md:text-base"> / noche</span>
                        </div>
                    </div>

                    {/* Características - Grid responsivo */}
                    <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">HUÉSPEDES</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.capacity}</p>
                        </div>
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">DORMITORIOS</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.bedrooms}</p>
                        </div>
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">BAÑOS</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.bathroom}</p>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                            <FavoriteButton hutId={hut.id} />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mt-4 md:mt-6">
                        <h2 className="text-lg md:text-xl font-semibold text-green-550 border-b border-green-250 pb-1">Descripción</h2>
                        <p className="mt-2 text-brown-450 text-sm md:text-base whitespace-pre-line">
                            {hut.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};