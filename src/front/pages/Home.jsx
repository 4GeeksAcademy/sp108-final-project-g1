import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import forestBirds from "../assets/audio/forest-birds.mp3"
import { Form } from "react-router-dom";


export const Home = () => {
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
						<div className="bg-gradient-to-br from-green-550 to-green-350/80 p-4 rounded-3xl text-center">
							<h3>Opiniones de nuestros clientes</h3>
						</div>
					</article>
					<Form className="flex sm:hidden mx-auto flex-col bg-gradient-to-br from-green-550 to-green-350/80 p-5 rounded-3xl gap-3 w-[300px]">
						<h2 className="text-center text-2xl">Planifica tu aventura</h2>
						<select className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-350">
							<option value="">Selecciona tu destino</option>
							<option value="barcelona">Barcelona</option>
							<option value="valencia">Valencia</option>
							<option value="sevilla">Sevilla</option>
						</select>
						<label>Fecha de entrada:</label>
						<input type="date" className="rounded bg-white/20 text-white pl-2" />
						<label>Fecha de salida:</label>
						<input type="date" className="rounded bg-white/20 text-white pl-2" />
						<button className="w-full bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-3 mt-2 hover:scale-[1.02]">Reservar</button>
					</Form>
					<article className="flex sm:hidden">
						<audio src={forestBirds} controls className="[&::-webkit-media-controls-panel]:bg-gradient-to-br from-green-550 via-green-250 to-brown-550/80 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white accent-green-350"></audio>
					</article>
					<Form className="hidden sm:flex flex-col bg-gradient-to-br from-green-550 to-green-350/80 p-5 rounded-3xl gap-3 w-[300px]">
						<h2 className="text-center text-2xl">Planifica tu aventura</h2>
						<select className="w-full p-2 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-350">
							<option value="">Selecciona tu destino</option>
							<option value="barcelona">Barcelona</option>
							<option value="valencia">Valencia</option>
							<option value="sevilla">Sevilla</option>
						</select>
						<label>Fecha de entrada:</label>
						<input type="date" className="rounded bg-white/20 pl-2" />
						<label>Fecha de salida:</label>
						<input type="date" className="rounded bg-white/20 pl-2" />
						<button className="w-full bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-3 mt-2 hover:scale-[1.02]">Reservar</button>
					</Form>
				</section>
			</div>
		</div>
	);
};