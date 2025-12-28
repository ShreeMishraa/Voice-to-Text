export default async function transcribeAudio(file) {
  const key = import.meta.env.VITE_HF_API_KEY
  if (!key) {
    throw new Error('Missing VITE_HF_API_KEY. Add it to your .env file.')
  }

  // Use a Whisper model hosted on Hugging Face inference API.
  const model = 'openai/whisper-large'

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      // Let the browser infer Content-Type from the Blob
    },
    body: file,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Hugging Face API error: ${res.status} ${body}`)
  }

  // The Inference API usually returns JSON with `{ "text": "..." }` for ASR models.
  const data = await res.json()
  return data
}


