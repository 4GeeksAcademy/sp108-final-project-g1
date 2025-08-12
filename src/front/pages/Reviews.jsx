import { useEffect, useState } from 'react'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { getAllReviews } from '../services/reviews'

export const Reviews = () => {
    const { store } = useGlobalReducer()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadReviews = async () => {
            try {
                if (!store.currentUser?.is_admin) throw new Error('No tiene permisos')
                const data = await getAllReviews()
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
                < p className="text-center text-white/80" > Aún no has dejado reseñas</p>
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