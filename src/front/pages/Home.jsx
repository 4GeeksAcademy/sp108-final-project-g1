import forestBirds from "../assets/audio/forest-birds.mp3"
import { useState, useEffect } from "react"


export const Home = () => {
	const [randomReview, setRandomReview] = useState(null)

	useEffect(() => {
		const fetchRandomReview = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
				const data = await response.json()
				if (Array.isArray(data) && data.length > 0) {
					const random = data[Math.floor(Math.random() * data.length)]
					setRandomReview(random)
				}
			} catch (err) {
				console.error('Error fetching reviews', err)
			}
		}
		fetchRandomReview()
	}, [])

	return (
		<div className="flex flex-col min-h-[100svh] text-white">
			<div className="flex flex-col flex-1 px-5">
				<section className="ml-5 mt-5 md:ml-10 md:mt-10">

					<h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight">
						<span className="bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent">MI</span><br />
						<span className="bg-gradient-to-br from-brown-350 to-green-250 bg-clip-text text-transparent">RINCÓN</span><br />
						<span className="font-bold bg-gradient-to-br from-green-450 to-green-150 bg-clip-text text-transparent">ESCONDIDO</span>
					</h1>

				</section>
				<section className="flex flex-col sm:flex-row justify-end mt-auto sm:justify-between items-center sm:items-end gap-4 pb-4">
					<article className="hidden sm:flex">
						<audio src={forestBirds} controls className="[&::-webkit-media-controls-panel]:bg-gradient-to-br from-green-550 via-green-250 to-brown-550/80 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white accent-green-350"></audio>
					</article>
					<article className="flex justify-center">
						<div className="bg-gradient-to-br from-green-550 to-green-350/80 p-4 rounded-3xl text-center max-w-sm">
							<h3 className="font-bold">Opiniones de nuestros clientes</h3>
							{randomReview ? (
								<div className="mt-2">
									<p className="italic">"{randomReview.comment}"</p>
									<p className="text-sm mt-1">- {randomReview.user_name}</p>
								</div>
							) : (
								<p className="mt-2">Cargando reseña...</p>
							)}
						</div>
					</article>
					<button
						onClick={() => window.location.href = '/maps'}
						className="flex sm:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Abrir Mapa
					</button>
					<article className="flex sm:hidden">
						<audio src={forestBirds} controls className="[&::-webkit-media-controls-panel]:bg-gradient-to-br from-green-550 via-green-250 to-brown-550/80 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white accent-green-350"></audio>
					</article>
					<button
						onClick={() => window.location.href = '/maps'}
						className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Abrir Mapa
					</button>
				</section>
			</div>
		</div>
	);
};