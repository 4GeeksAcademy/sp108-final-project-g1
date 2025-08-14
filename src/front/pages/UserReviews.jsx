import { useEffect, useState } from 'react'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { getUserReviews } from '../services/reviews'

export const UserReviews = () => {
    const { store } = useGlobalReducer()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadReviews = async () => {
            try {
                if (!store.currentUser?.id) throw new Error('No hay usuario autenticado')
                const data = await getUserReviews(store.currentUser.id)
                setReviews(data)
            } catch (error) {
                throw error('Error al cargar las reseñas')
            } finally {
                setLoading(false)
            }
        }
        loadReviews()
    }, [store.currentUser?.id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 bg-black/50 min-h-screen">
                <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
                    <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>
                        Reseñas
                    </span>
                </h1>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>
                <p className="text-center text-white/80">Cargando reseñas...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 bg-black/50 min-h-screen">
                <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
                    <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>
                        Reseñas
                    </span>
                </h1>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>
                <p className="text-center text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-black/50 min-h-screen">
            <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>
                    Reseñas
                </span>
            </h1>
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>

            {reviews.length === 0 ? (
                <div className="bg-brown-150 border-2 border-brown-250 rounded-lg p-8 text-center shadow-sm">
                    <p className="text-brown-550 text-xl mb-6">Aún no has dejado reseñas</p>
                    <button
                        onClick={() => navigate('/huts')}
                        className="bg-green-350 hover:bg-green-450 text-white font-bold py-3 px-8 rounded-md shadow-md transition-all hover:shadow-lg"
                    >
                        Explorar Cabañas Disponibles
                    </button>
                </div>
            ) : (
                <ul className="space-y-4 max-w-3xl mx-auto">
                    {reviews.map(review => (
                        <li key={review.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="flex justify-end">
                                <span className="text-yellow-300 font-bold">
                                    {review.rating} ★
                                </span>
                            </div>
                            <p className="text-white/90 mt-2 break-words">
                                {review.comment}
                            </p>
                            <p className="text-white/50 text-sm mt-2">
                                {new Date(review.created_at).toLocaleDateString('es-ES')}
                            </p>
                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    )
}
