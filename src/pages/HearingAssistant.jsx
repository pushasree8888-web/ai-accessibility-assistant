import { useEffect, useRef, useState } from 'react'
import LargeButton from '../components/ui/LargeButton'
import { useLanguage } from '../context/LanguageContext'

export default function HearingAssistant() {
  const { selectedLanguage } = useLanguage()
  const [captions, setCaptions] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)
  const keepListeningRef = useRef(false)

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = selectedLanguage.code

    recognition.onstart = () => {
      setListening(true)
      setError('')
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim()

      if (transcript) {
        setCaptions(transcript)
        setError('')
      }
    }

    recognition.onnomatch = () => {
      setError('No speech was recognized. Please speak clearly into your microphone.')
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError('Microphone permission was denied. Allow the browser to use your microphone and try again.')
      } else if (event.error === 'no-speech') {
        setError('No speech was detected. Please speak louder or try again.')
      } else if (event.error === 'network') {
        setError('Speech recognition network error. Please use Google Chrome with microphone permission enabled.')
      } else if (event.error === 'audio-capture') {
        setError('No microphone was found. Please connect a microphone and try again.')
      } else if (event.error === 'aborted') {
        setError('Speech recognition was aborted. Please try again.')
      } else {
        setError(
          event.error
            ? `Speech recognition error: ${event.error}`
            : 'Speech recognition is unavailable. Please use Google Chrome with microphone permission enabled.'
        )
      }
      keepListeningRef.current = false
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
      if (keepListeningRef.current) {
        const nextRecognition = createRecognition()
        recognitionRef.current = nextRecognition
        if (nextRecognition) {
          try {
            nextRecognition.start()
          } catch {
            setError('Unable to restart speech recognition. Please try again.')
          }
        }
      }
    }

    return recognition
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    recognitionRef.current = createRecognition()

    return () => {
      keepListeningRef.current = false
      if (recognitionRef.current && recognitionRef.current.abort) {
        recognitionRef.current.abort()
      }
    }
  }, [selectedLanguage.code])

  const startListening = () => {
    setError('')
    if (!recognitionRef.current) {
      setSupported(false)
      setError('Speech recognition is unavailable. Please use Google Chrome with microphone permission enabled.')
      return
    }

    if (listening) {
      return
    }

    keepListeningRef.current = true

    try {
      recognitionRef.current.start()
    } catch (err) {
      setError(
        err?.message
          ? `Speech recognition failed: ${err.message}`
          : 'Unable to activate speech recognition. Please ensure the browser has microphone access.'
      )
      setListening(false)
    }
  }

  const stopListening = () => {
    keepListeningRef.current = false
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop()
    }
    setListening(false)
  }

  return (
    <section className="assistant-page" aria-labelledby="hearing-assistant-title">
      <h1 id="hearing-assistant-title">Hearing Assistant ({selectedLanguage.flag} {selectedLanguage.name})</h1>
      <p className="assistant-page__description">
        Speak naturally in {selectedLanguage.name} and see your words appear as large, readable captions on the screen.
      </p>

      <div className="assistant-card assistant-card--centered">
        <div className="audio-controls">
          <LargeButton
            onClick={startListening}
            disabled={!supported || listening}
            ariaLabel={`Start listening for speech in ${selectedLanguage.name}`}
          >
            🎤 Start Listening ({selectedLanguage.name})
          </LargeButton>
          <LargeButton
            onClick={stopListening}
            disabled={!listening}
            ariaLabel="Stop listening for speech"
          >
            ⏹ Stop Listening
          </LargeButton>
        </div>

        {error && <p className="assistant-error">{error}</p>}

        {!supported && (
          <p className="assistant-note">
            Speech recognition is unavailable. Please use Google Chrome with microphone permission enabled.
          </p>
        )}

        <div className="caption-panel" aria-live="polite" aria-label={`Live speech captions in ${selectedLanguage.name}`}>
          {captions || `Your spoken words in ${selectedLanguage.name} will appear here as captions.`}
        </div>
      </div>
    </section>
  )
}
