import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import forestBirds from "../assets/audio/forest-birds.mp3"


export const Home = () => {

	return (
		<div className="h-[86vh] w-full flex flex-col justify-start">
			<section className="ml-10 my-10 md:left-5">
				<h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight">
					<span className="bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent">MI</span><br />
					<span className="bg-gradient-to-br from-brown-350 to-green-250 bg-clip-text text-transparent">RINCÓN</span><br />
					<span className="font-bold bg-gradient-to-br from-green-450 to-green-150 bg-clip-text text-transparent">ESCONDIDO</span>
				</h1>
			</section>
			<section className="flex flex-col sm:flex-row justify-center sm:justify-between sm:items-end items-center gap-5">
				<article className="flex justify-center">
					<div className="bg-gradient-to-br from-green-550 to-green-350/80 p-5 rounded-3xl text-center">
						<h3>Opiniones de nuestros clientes</h3>
					</div>
				</article>
				<article className="flex sm:hidden mx-auto flex-col bg-gradient-to-br from-green-550 to-green-350/80 md:bg-green-150/20 p-5 rounded-3xl md:bottom-5 md:right-5 gap-5 w-[300px]">
					<h2 className="text-center text-3xl">Planifica tu aventura</h2>
					<select name="Ciudades" id="locations" className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-350">
						<option value="" className="bg-green-350">Selecciona tu destino</option>
						<option value="barcelona" className="bg-green-350">Barcelona</option>
						<option value="valencia" className="bg-green-350">Valencia</option>
						<option value="sevilla" className="bg-green-350">Sevilla</option>
					</select>
					<label htmlFor="">Fecha de entrada:</label>
					<input type="date" id="check-in" className="rounded bg-white/20 text-white pl-2" />
					<label htmlFor="">Fecha de salida:</label>
					<input type="date" id="check-out" className="rounded bg-white/20 text-white pl-2" />
					<button className="w-full bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-3 mt-3 hover:scale-[1.02]">Reservar</button>
				</article>
				{/* md:absolute md:bottom-40 md:left-10 lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 gap-5 w-[300px] text-center */}
				<article className="">
					<audio src={forestBirds} controls className="[&::-webkit-media-controls-panel]:bg-gradient-to-br from-green-550 via-green-250 to-brown-550/80 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white accent-green-350"></audio>
				</article>
				<article className="hidden sm:flex mx-auto flex-col bg-gradient-to-br from-green-550 to-green-350/80 md:bg-green-150/20 p-5 rounded-3xl md:bottom-5 md:right-5 gap-5 w-[300px]">
					<h2 className="text-center text-3xl">Planifica tu aventura</h2>
					<select name="Ciudades" id="locations" className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-350">
						<option value="" className="bg-green-350">Selecciona tu destino</option>
						<option value="barcelona" className="bg-green-350">Barcelona</option>
						<option value="valencia" className="bg-green-350">Valencia</option>
						<option value="sevilla" className="bg-green-350">Sevilla</option>
					</select>
					<label htmlFor="">Fecha de entrada:</label>
					<input type="date" id="check-in" className="rounded bg-white/20 text-white pl-2" />
					<label htmlFor="">Fecha de salida:</label>
					<input type="date" id="check-out" className="rounded bg-white/20 text-white pl-2" />
					<button className="w-full bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-3 mt-3 hover:scale-[1.02]">Reservar</button>
				</article>
			</section>
		</div>
	);
};
