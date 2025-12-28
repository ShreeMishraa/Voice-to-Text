export default async function transcribeAudio(audioBlob) {
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    body: audioBlob,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }

  const data = await res.json()

  // Hugging Face sometimes returns array
  if (Array.isArray(data)) {
    return data[0]?.text || ''
  }

  return data.text || ''
}
