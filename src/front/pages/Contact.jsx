import { useState } from "react"

export const Contact = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")

  const handleName = (event) => {
    setName(event.target.value)
  }

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }

  const handleComment = (event) => {
    setComment(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch("https://formspree.io/f/movllynz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: comment,
        }),
      })
      if (response.ok) {
        alert("¡Mensaje enviado con éxito!")
        setName("")
        setEmail("")
        setComment("")
      } else {
        alert("Error al enviar el mensaje.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Hubo un error al enviar el formulario.")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen px-5 md:px-0 text-white">
        <div className="flex flex-col rounded-2xl w-full md:max-w-xl gap-4 border-8 border-brown-250 p-6 contact bg-stone-800/50">
          <h1 className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-150 to-green-350 bg-clip-text text-transparent">
            Contáctanos
          </h1>
          <label htmlFor="name">Nombre</label>
          <input onChange={handleName} type="text" id="name" name="name" className="border w-full bg-stone-300/10 px-3 py-2 rounded" value={name} />
          <label htmlFor="email">Correo Electrónico</label>
          <input onChange={handleEmail} type="email" id="email" name="email" className="border w-full bg-stone-300/10 px-3 py-2 rounded" value={email} />
          <label htmlFor="comment">Tu consulta:</label>
          <textarea onChange={handleComment} id="comment" name="message" className="min-h-[150px] border bg-stone-300/10 p-3 rounded" placeholder="Escribe tu mensaje aquí" value={comment} />
          <div className="flex justify-between gap-4 mt-4">
            <button onClick={() => { setName(""); setEmail(""); setComment(""); }} type="button" className="w-1/2 bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-450 text-xl p-2 hover:scale-[1.02]">
              Borrar
            </button>
            <button type="submit" className="w-1/2 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-xl p-2 hover:scale-[1.02]">
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}