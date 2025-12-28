import { useEffect, useRef, useState } from 'react'
import Controls from './components/Controls'
import LanguageSelect from './components/LanguageSelect'
import Transcript from './components/Transcript'
import Actions from './components/Actions'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

function App() {
  const recognitionRef = useRef(null)

  const [isRecording, setIsRecording] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [language, setLanguage] = useState('en-US')

  useEffect(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onresult = (event) => {
      let interim = ''
      let final = finalText

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        event.results[i].isFinal
          ? (final += transcript + ' ')
          : (interim += transcript)
      }

      setFinalText(final)
      setInterimText(interim)
    }

    recognition.onend = () => {
      if (isRecording) recognition.start()
    }

    recognitionRef.current = recognition
  }, [language])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const clearText = () => {
    setFinalText('')
    setInterimText('')
  }

  return (
    <div className="container">
      <h1>🎤 Voice-to-Text Transcription</h1>

      <Controls
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />

      <LanguageSelect language={language} setLanguage={setLanguage} />

      <Transcript finalText={finalText} interimText={interimText} />

      <Actions
        finalText={finalText}
        clearText={clearText}
      />
    </div>
  )
}

export default App
