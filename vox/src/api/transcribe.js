export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const HF_KEY = process.env.VITE_HF_API_KEY
    if (!HF_KEY) {
      return res.status(500).json({ error: 'Missing Hugging Face API key' })
    }

    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
        },
        body: req.body,
      }
    )

    if (!hfRes.ok) {
      const err = await hfRes.text()
      return res.status(hfRes.status).json({ error: err })
    }

    const data = await hfRes.json()
    return res.status(200).json(data)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Transcription failed' })
  }
}
