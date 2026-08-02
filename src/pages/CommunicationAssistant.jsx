import { useState } from 'react'
import LargeButton from '../components/ui/LargeButton'

export default function CommunicationAssistant() {
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
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      setStatus('Speaking your message now...')
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
      <h1 id="communication-assistant-title">Communication Assistant</h1>
      <p className="assistant-page__description">
        Type a phrase and play it back with voice output for clearer communication.
      </p>

      <div className="assistant-card assistant-card--centered">
        <label className="input-label" htmlFor="communication-message">
          Enter text to speak aloud
        </label>
        <textarea
          id="communication-message"
          className="assistant-textarea"
          rows="6"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type something like, 'Hello, how can I help you?'"
        />

        <LargeButton
          onClick={handleSpeak}
          disabled={!text.trim()}
          ariaLabel="Play typed message as speech"
        >
          Play Voice
        </LargeButton>

        {status && <p className="assistant-note">{status}</p>}
      </div>
    </section>
  )
}
