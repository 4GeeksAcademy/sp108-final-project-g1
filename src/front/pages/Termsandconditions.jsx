import { Link } from "react-router-dom"

export const TermsAndConditions = () => {

  return (
    <div className="flex flex-col items-center mx-auto px-4 py-12 bg-components">
      <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 text-white">
        <span className="bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent">Términos y Condiciones</span>
      </h1>
      <p className="text-white mb-8">Última actualización: <strong>14 de agosto de 2025</strong></p>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>
      <div className="max-w-4xl w-full bg-stone-800/50 p-6 rounded-2xl text-white">
    
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Aceptación de los Términos</h2>
          <p>Al utilizar este sitio web, aceptas cumplir con estos términos y condiciones, así como con cualquier actualización o cambio de los mismos. Si no estás de acuerdo con estos términos, por favor no uses el sitio.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Uso del Sitio Web</h2>
          <p>Este sitio web está diseñado para ofrecer servicios relacionados con el alquiler de cabañas en entornos naturales y tranquilos bajo el nombre de "Mi Rincón Escondido". Te comprometes a usar el sitio de manera legal y respetuosa, sin infringir ninguna ley o derecho de terceros.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Derechos de Propiedad Intelectual</h2>
          <p>Todo el contenido de este sitio web, incluidos textos, imágenes, gráficos y logotipos, están protegidos por derechos de autor y son propiedad de "Mi Rincón Escondido". Queda prohibido copiar, reproducir o distribuir cualquier contenido sin el consentimiento expreso del propietario.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Protección de Datos</h2>
          <p>Nos comprometemos a proteger tu privacidad. Los datos personales que nos proporcionas se utilizarán únicamente para los fines establecidos en nuestra <Link to="/privacyandpolicy" className="text-blue-400">Política de Privacidad</Link>. Nunca compartiremos tu información con terceros sin tu consentimiento, excepto en los casos previstos por la ley.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Limitación de Responsabilidad</h2>
          <p>El sitio web y los servicios proporcionados se ofrecen "tal cual". No nos hacemos responsables de ningún daño, pérdida o perjuicio relacionado con el uso del sitio, incluyendo pero no limitado a daños a tu equipo, pérdida de datos o interrupciones del servicio.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Cancelaciones</h2>
          <p>Para cualquier cancelación de reserva, es necesario ponerse en contacto con nosotros a través de nuestro correo electrónico o teléfono. Las cancelaciones realizadas con menos de 48 horas de antelación serán <span className="font-bold">facturadas</span>. Apreciamos tu comprensión.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">7. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento. Te recomendamos revisar periódicamente esta página para estar al tanto de cualquier cambio. Las modificaciones entrarán en vigor en el momento de su publicación en el sitio.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">8. Contacto</h2>
          <p>Si tienes alguna pregunta sobre estos términos, no dudes en contactarnos a través del correo electrónico: <strong>contacto@mirinconescondido.com</strong> o llamando al teléfono: <strong>+34 123 456 789</strong>.</p>
        </div>
      </div>
    </div>
  )
}