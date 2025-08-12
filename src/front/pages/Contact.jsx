import { useState } from "react"
import { postContact } from "../services/contact"
import { toast } from 'react-toastify'

export const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await postContact({
        name,
        email,
        message: comment
      })

      toast.success('¡Mensaje enviado con éxito!', {
        position: "top-center",
        autoClose: 3000,
        theme: "colored"
      })
      setName("")
      setEmail("")
      setComment("")
    } catch (error) {
      console.error("Error:", error)
      toast.error('Hubo un error al enviar el formulario', {
        position: "top-center",
        autoClose: 3000,
        theme: "colored"
      })
    }
  }

  return (
    <div className="flex flex-col items-center mx-auto px-4 py-12 bg-black/50 min-h-screen">
      <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
        <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>Contáctanos</span>
      </h1>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>
      
      <form onSubmit={handleSubmit} className="flex items-center justify-center w-full px-5 md:px-0 text-white">
        <div className="flex flex-col rounded-2xl w-full max-w-4xl gap-6 md:max-w-xl border-8 border-brown-250 p-6 contact bg-stone-800/50">
          
          <label htmlFor="name" className="text-lg">Nombre</label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            type="text" 
            id="name" 
            name="name" 
            className="border w-full bg-stone-300/10 px-4 py-3 rounded-lg text-lg" 
            value={name} 
            required
          />
          
          <label htmlFor="email" className="text-lg">Correo Electrónico</label>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            id="email" 
            name="email" 
            className="border w-full bg-stone-300/10 px-4 py-3 rounded-lg text-lg" 
            value={email} 
            required
          />
          
          <label htmlFor="comment" className="text-lg">Tu consulta:</label>
          <textarea 
            onChange={(e) => setComment(e.target.value)} 
            id="comment" 
            name="message" 
            className="min-h-[150px] w-full border bg-stone-300/10 p-4 rounded-lg text-lg max-h-[300px] md:max-h-[400px] placeholder:text-stone-300" 
            placeholder="Escribe tu mensaje aquí" 
            value={comment} 
            required
          />
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <button 
              onClick={() => { setName(""); setEmail(""); setComment("") }} 
              type="button" 
              className="w-full sm:w-1/2 bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-450 text-xl p-3 hover:scale-[1.02]">
              Borrar
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-1/2 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-3 hover:scale-[1.02]">
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
