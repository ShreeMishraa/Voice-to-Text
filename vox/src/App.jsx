import { useEffect, useRef, useState } from 'react'
import Controls from './components/Controls'
import LanguageSelect from './components/LanguageSelect'
import Transcript from './components/Transcript'
import Actions from './components/Actions'
import bg from './assets/bg.jpg'
import transcribeAudio from './api/huggingface'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

function App() {
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioChunksRef = useRef([])

  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [language, setLanguage] = useState('en-US')

  /* 🔹 Speech Recognition (Live Preview) */
  useEffect(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onresult = (event) => {
      let interim = ''
      let finalChunk = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        event.results[i].isFinal
          ? (finalChunk += text + ' ')
          : (interim += text)
      }

      if (finalChunk) {
        setFinalText(prev => prev + finalChunk)
      }
      setInterimText(interim)
    }

    recognition.onend = () => {
      if (isRecording) recognition.start()
    }

    recognitionRef.current = recognition

    return () => {
      try { recognition.stop() } catch {}
    }
  }, [language, isRecording])

  /* 🔹 Toggle Recording */
  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      setInterimText('')

      try { recognitionRef.current?.stop() } catch {}

      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      return
    }

    // START RECORDING
    setIsRecording(true)

    try { recognitionRef.current?.start() } catch {}

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const mimeType =
        MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/wav'

      const mr = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setIsLoading(true)

        try {
          const text = await transcribeAudio(blob)
          if (text) {
            setFinalText(prev => prev + (prev ? '\n' : '') + text)
          }
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
          mediaStreamRef.current?.getTracks().forEach(t => t.stop())
        }
      }

      mr.start()
      mediaRecorderRef.current = mr
    } catch (err) {
      console.error('Mic access failed', err)
      setIsRecording(false)
    }
  }

  /* 🔹 Clear Transcript */
  const clearText = () => {
    setFinalText('')
    setInterimText('')
  }

  return (
    <div
      className="app"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-card">
        <h1 className="title">Voice to Text</h1>
        <p className="subtitle">Turn speech into words. Instantly.</p>

        <Controls
          isRecording={isRecording}
          toggleRecording={toggleRecording}
        />

        <LanguageSelect
          language={language}
          setLanguage={setLanguage}
        />

        <Transcript
          finalText={finalText}
          interimText={interimText}
          isLoading={isLoading}
        />

        <Actions
          finalText={finalText}
          clearText={clearText}
        />
      </div>
    </div>
  )
}

export default App
