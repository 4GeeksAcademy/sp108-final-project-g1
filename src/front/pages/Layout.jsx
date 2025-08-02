import { Outlet } from "react-router-dom"; // Cambia la importación
import ScrollToTop from "../components/ScrollToTop.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> {/* Contenedor principal */}
      <ScrollToTop>
        <Navbar />
        <main className="body flex-grow"> {/* Contenedor del contenido */}
          <Outlet />
        </main>
        <Footer />
      </ScrollToTop>
    </div>
  );
};