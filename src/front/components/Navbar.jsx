import { useState } from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
  const [menuIsActive, setMenuIsActive] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleMenu = () => {
    setMenuIsActive(!menuIsActive)
  }

  const handleConnected = () => {
    setIsConnected(!isConnected)
  }


  return (
    <nav className="relative text-xl text-white">
      <ul className="flex justify-between items-center bg-black/90 py-3 px-3 md:px-5 lg:px-16">
        <li className="md:hidden" onClick={handleMenu}>
          {
            !menuIsActive ?
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-menu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8l16 0" /><path d="M4 16l16 0" /></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
          }
        </li>
        <li className="md:hover:scale-105">
          <Link to="/">
            <svg fill="#ffffff" height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 479 479" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M394.902,95.52L242.667,0.904c-1.939-1.205-4.395-1.205-6.334,0L84.097,95.52c-1.762,1.095-2.833,3.021-2.833,5.096v26.004 c0,2.179,1.181,4.186,3.085,5.244c1.903,1.06,4.232,1.002,6.082-0.148l7.703-4.788v196.231c0,3.313,2.687,6,6,6h4.642v24.653 c0,3.313,2.687,6,6,6h19.082V473c0,3.313,2.687,6,6,6h22.754c3.313,0,6-2.687,6-6v-50.77l62.407-62.418h16.959l62.407,62.418V473 c0,3.313,2.687,6,6,6h22.754c3.313,0,6-2.687,6-6V359.812h19.082c3.313,0,6-2.687,6-6v-24.653h4.642c3.313,0,6-2.687,6-6V126.927 l7.704,4.788c0.968,0.602,2.066,0.904,3.167,0.904c1.003,0,2.008-0.251,2.915-0.756c1.904-1.059,3.085-3.065,3.085-5.244v-26.004 C397.735,98.542,396.664,96.615,394.902,95.52z M145.858,467V359.812h10.754V467H145.858z M168.612,359.812h13.274l-13.274,13.27 V359.812z M168.612,405.258V390.05l30.248-30.238h15.191L168.612,405.258z M264.948,359.812h15.191l30.248,30.238v15.208 L264.948,359.812z M310.386,373.082l-13.274-13.27h13.274V373.082z M333.14,467h-10.754V359.812h10.754V467z M358.222,347.812 H120.776v-18.653h237.446V347.812z M368.864,317.159H110.135V119.47L239.5,39.069l129.364,80.4V317.159z M385.735,115.827 L242.667,26.909c-0.97-0.603-2.068-0.904-3.167-0.904s-2.197,0.302-3.167,0.904L93.264,115.827v-11.876L239.5,13.064 l146.235,90.887V115.827z"></path> <path d="M212.461,132.19h-72.104c-3.313,0-6,2.687-6,6v107.681c0,3.313,2.687,6,6,6h72.104c3.313,0,6-2.687,6-6V138.19 C218.461,134.876,215.774,132.19,212.461,132.19z M206.461,144.19v9.876h-60.104v-9.876H206.461z M146.357,196.685v-9.31h60.104 v9.31H146.357z M206.461,208.685v9.31h-60.104v-9.31H206.461z M146.357,175.375v-9.31h60.104v9.31H146.357z M146.357,239.871 v-9.876h60.104v9.876H146.357z"></path> <path d="M260.037,251.871h72.104c3.313,0,6-2.687,6-6V138.19c0-3.313-2.687-6-6-6h-72.104c-3.313,0-6,2.687-6,6v107.681 C254.037,249.184,256.723,251.871,260.037,251.871z M266.037,239.871v-9.876h60.104v9.876H266.037z M326.141,187.375v9.31h-60.104 v-9.31H326.141z M266.037,175.375v-9.31h60.104v9.31H266.037z M326.141,208.685v9.31h-60.104v-9.31H326.141z M326.141,144.19v9.876 h-60.104v-9.876H326.141z"></path> </g> </g></svg>
          </Link>
        </li>
        <div className="hidden md:flex md:items-center md:gap-8 md:ml-auto">
          <li>
            <Link to="/" className="hidden md:block hover:scale-105 hover:text-green-150 transition">Cabañas</Link>
          </li>
          <li>
            <Link to="/" className="hidden md:block hover:scale-105 hover:text-green-150 transition">Reservas</Link>
          </li>
          <li>
            <Link to="/" className="hidden md:block hover:scale-105 hover:text-green-150 transition">Favoritos</Link>
          </li>
          <li>
            <Link to="/contact" className="hidden md:block hover:scale-105 hover:text-green-150 transition">Contacto</Link>
          </li>
          <li>
            <Link to="/profile" className="hidden md:block hover:scale-105 hover:text-green-150 transition">Mi Perfil</Link>
          </li>
        </div>
        <li className="md:ml-14 md:hover:scale-105">
          <Link to="/login" onClick={handleConnected}>
            {
              !isConnected ?
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-logout-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
            }
          </Link>
        </li>
      </ul>
      {
        menuIsActive && (
          <div className="bg-black w-full h-screen absolute z-50 text-3xl font-bold md:hidden">
            <ul className="flex flex-col gap-4 w-full p-4">
              <li className="group">
                <Link to="/huts" className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brown-550 to-brown-150 border border-green-250 flex items-center hover:scale-105 hover:contrast-125 transition px-4 py-3 gap-4" onClick={() => setMenuIsActive(false)}>
                  <svg className="group-hover:scale-150 group-hover:-rotate-12 transition" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                  <span>Cabañas</span>
                </Link>
              </li>
              <li className="group">
                <Link to="/" className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brown-550 to-brown-150 border border-green-250 flex items-center hover:scale-105 hover:contrast-125 transition px-4 py-3 gap-4" onClick={() => setMenuIsActive(false)}>
                  <svg className="group-hover:scale-150 group-hover:-rotate-12 transition" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 7l1 0" /><path d="M9 13l6 0" /><path d="M13 17l2 0" /></svg>
                  <span>Reservas</span>
                </Link>
              </li>
              <li className="group">
                <Link to="/" className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brown-550 to-brown-150 border border-green-250 flex items-center hover:scale-105 hover:contrast-125 transition px-4 py-3 gap-4" onClick={() => setMenuIsActive(false)}>
                  <svg className="group-hover:scale-150 group-hover:-rotate-12 transition" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h6" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2c.39 0 .754 .112 1.061 .304" /><path d="M19 21.5l2.518 -2.58a1.74 1.74 0 0 0 0 -2.413a1.627 1.627 0 0 0 -2.346 0l-.168 .172l-.168 -.172a1.627 1.627 0 0 0 -2.346 0a1.74 1.74 0 0 0 0 2.412l2.51 2.59z" /></svg>
                  <span>Favoritos</span>
                </Link>
              </li>
              <li className="group">
                <Link to="/contact" className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brown-550 to-brown-150 border border-green-250 flex items-center hover:scale-105 hover:contrast-125 transition px-4 py-3 gap-4" onClick={() => setMenuIsActive(false)}>
                  <svg className="group-hover:scale-150 group-hover:-rotate-12 transition" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M3 7l9 6l9 -6" /></svg>
                  <span>Contacto</span>
                </Link>
              </li>
              <li className="group">
                <Link to="/profile" className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brown-550 to-brown-150 border border-green-250 flex items-center hover:scale-105 hover:contrast-125 transition px-4 py-3 gap-4" onClick={() => setMenuIsActive(false)}>
                  <svg className="group-hover:scale-150 group-hover:-rotate-12 transition" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" /><path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" /></svg>
                  <span>Mi perfil</span>
                </Link>
              </li>
            </ul>
          </div>
        )
      }
    </nav>
  );
};
