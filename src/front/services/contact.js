export const postContact = async (formData) => {
  try {
    const response = await fetch("https://formspree.io/f/movllynz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error("Error al enviar el mensaje")

    return true
  } catch (error) {
    console.error("Error en contactService:", error)
    throw error
  }
}