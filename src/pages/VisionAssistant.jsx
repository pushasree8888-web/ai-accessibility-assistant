import { useEffect, useRef, useState } from 'react'
import LargeButton from '../components/ui/LargeButton'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function VisionAssistant() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setSpeechSupported(false)
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event) => {
    setError('')
    setAnalysis(null)
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      setPreviewUrl('')
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      setFile(null)
      setPreviewUrl('')
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const analyzeImage = async () => {
    if (!file) {
      setError('Choose an image before analyzing.')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/vision/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.detail || 'Unable to analyze the image.')
      } else {
        setAnalysis(data)
      }
    } catch (err) {
      setError('Failed to connect to the backend. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReadAloud = () => {
    if (!analysis || !speechSupported) {
      return
    }

    if (window.speechSynthesis.speaking) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(analysis.description)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      setSpeaking(true)
      setPaused(false)
    }

    utterance.onend = () => {
      setSpeaking(false)
      setPaused(false)
      utteranceRef.current = null
    }

    utterance.onerror = () => {
      setSpeaking(false)
      setPaused(false)
      utteranceRef.current = null
      setError('Speech synthesis failed. Please try again.')
    }

    utteranceRef.current = utterance
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const handlePauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  const handleResumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    }
  }

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
    utteranceRef.current = null
  }

  return (
    <section className="assistant-page" aria-labelledby="vision-assistant-title">
      <h1 id="vision-assistant-title">Vision Assistant</h1>
      <p className="assistant-page__description">
        Upload an image to receive a quick accessibility analysis including detected objects and suggestions.
      </p>

      <div className="assistant-card assistant-card--centered">
        <label className="input-label" htmlFor="vision-image-upload">
          Select an image file
        </label>
        <input
          id="vision-image-upload"
          className="assistant-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-describedby="vision-upload-description"
        />
        <p id="vision-upload-description" className="assistant-note">
          Choose a clear photo for the best accessibility analysis.
        </p>

        {previewUrl && (
          <div className="image-preview-wrapper">
            <img
              src={previewUrl}
              alt="Selected preview"
              className="image-preview"
            />
          </div>
        )}

        <LargeButton
          onClick={analyzeImage}
          disabled={!file || loading}
          ariaLabel="Analyze uploaded image"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </LargeButton>

        {error && <p className="assistant-error">{error}</p>}

        {analysis && (
          <div className="result-panel">
            <div className="result-header">
              <h2>Accessibility analysis</h2>
              {speechSupported ? (
                <div className="audio-controls">
                  <LargeButton onClick={handleReadAloud} ariaLabel="Read description aloud">
                    🔊 Read Aloud
                  </LargeButton>
                  <LargeButton
                    onClick={handlePauseSpeech}
                    disabled={!speaking || paused}
                    ariaLabel="Pause speech playback"
                  >
                    ⏸ Pause
                  </LargeButton>
                  <LargeButton
                    onClick={handleResumeSpeech}
                    disabled={!paused}
                    ariaLabel="Resume speech playback"
                  >
                    ▶️ Resume
                  </LargeButton>
                  <LargeButton
                    onClick={handleStopSpeech}
                    disabled={!speaking && !paused}
                    ariaLabel="Stop speech playback"
                  >
                    ⏹ Stop
                  </LargeButton>
                </div>
              ) : (
                <p className="assistant-note">Text-to-speech is not supported in this browser.</p>
              )}
            </div>
            <p>{analysis.description}</p>
            <div className="result-list">
              <strong>Detected objects:</strong>
              <ul>
                {analysis.objects.map((object) => (
                  <li key={object}>{object}</li>
                ))}
              </ul>
            </div>
            <p>
              <strong>Suggestion:</strong> {analysis.suggestion}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
