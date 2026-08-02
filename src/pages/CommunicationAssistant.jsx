import { useState } from 'react'
import LargeButton from '../components/ui/LargeButton'
import { useLanguage } from '../context/LanguageContext'

export default function CommunicationAssistant() {
  const { selectedLanguage } = useLanguage()
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const handleSpeak = () => {
    if (!text.trim()) {
      setStatus('Type a message first to hear it aloud.')
      return
    }

    if (!window.speechSynthesis) {
      setStatus('Speech synthesis is not supported in this browser.')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.lang = selectedLanguage.code

    utterance.onstart = () => {
      setStatus(`Speaking your message in ${selectedLanguage.name}...`)
    }

    utterance.onend = () => {
      setStatus('Message spoken aloud successfully.')
    }

    utterance.onerror = () => {
      setStatus('Unable to play speech. Please try again.')
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <section className="assistant-page" aria-labelledby="communication-assistant-title">
      <h1 id="communication-assistant-title">Communication Assistant ({selectedLanguage.flag} {selectedLanguage.name})</h1>
      <p className="assistant-page__description">
        Type a phrase and play it back with voice output in {selectedLanguage.name} for clearer communication.
      </p>

      <div className="assistant-card assistant-card--centered">
        <label className="input-label" htmlFor="communication-message">
          Enter text to speak aloud ({selectedLanguage.name})
        </label>
        <textarea
          id="communication-message"
          className="assistant-textarea"
          rows="6"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`Type a message in ${selectedLanguage.name}...`}
        />

        <LargeButton
          onClick={handleSpeak}
          disabled={!text.trim()}
          ariaLabel={`Play typed message as speech in ${selectedLanguage.name}`}
        >
          🔊 Play Voice ({selectedLanguage.name})
        </LargeButton>

        {status && <p className="assistant-note">{status}</p>}
      </div>
    </section>
  )
}
