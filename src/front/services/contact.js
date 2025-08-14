export const postContact = async ({ name, email, message }) => {
  const fd = new FormData()
  fd.append("name", name)
  fd.append("email", email)
  fd.append("message", message)

  const response = await fetch("https://formspree.io/f/movllynz", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: fd
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const msg =
      data?.errors?.map((x) => x.message).join(", ")
      || data?.message
      || `Error al enviar el mensaje (HTTP ${response.status})`
    throw new Error(msg)
  }

  return true
}