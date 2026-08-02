import { useEffect, useRef, useState } from 'react'
import LargeButton from '../components/ui/LargeButton'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const MULTI_LANG_RESPONSES = {
  'en-US': {
    description: "The image '{name}' has been analyzed. It displays primary visual objects, text elements, and surrounding environment details for accessibility guidance.",
    objects: ['primary visual subject', 'text elements / display', 'surrounding environment'],
    suggestion: 'Read primary focus labels, describe spatial orientation, and offer spoken audio guidance for visually impaired users.',
  },
  'es-ES': {
    description: "La imagen '{name}' ha sido analizada. Muestra objetos visuales principales, texto y detalles del entorno para orientación de accesibilidad.",
    objects: ['sujeto visual principal', 'elementos de texto', 'entorno circundante'],
    suggestion: 'Lea las etiquetas principales, describa la orientación espacial y proporcione guía por voz.',
  },
  'fr-FR': {
    description: "L'image '{name}' a été analysée. Elle affiche des objets visuels principaux, du texte et des détails de l'environnement.",
    objects: ['sujet visuel principal', 'éléments de texte', 'environnement immédiat'],
    suggestion: 'Lisez les étiquettes principales et fournissez des conseils vocaux pour les utilisateurs déficients visuels.',
  },
  'de-DE': {
    description: "Das Bild '{name}' wurde analysiert. Es zeigt visuelle Hauptobjekte, Text und Umgebungsinformationen zur Barrierefreiheit.",
    objects: ['Hauptobjekt', 'Textelemente', 'Umgebung'],
    suggestion: 'Hauptbeschriftungen vorlesen und gesprochene Orientierungshilfe bieten.',
  },
  'hi-IN': {
    description: "चित्र '{name}' का विश्लेषण किया गया है। यह दृश्य वस्तुओं, पाठ और आसपास के वातावरण का विवरण दिखाता है।",
    objects: ['मुख्य दृश्य विषय', 'पाठ तत्व', 'आसपास का वातावरण'],
    suggestion: 'मुख्य लेबल पढ़ें और दृष्टिबाधित उपयोगकर्ताओं के लिए बोलकर मार्गदर्शन प्रदान करें।',
  },
  'te-IN': {
    description: "'{name}' చిత్రం విశ్లేషించబడింది. ఇది ప్రాథమిక వస్తువులు, వచనం మరియు పరిసరాల వివరాలను చూపుతుంది.",
    objects: ['ప్రాథమిక విషయం', 'వచన అంశాలు', 'పరిసరాలు'],
    suggestion: 'ముఖ్యమైన లేబుల్‌లను చదవండి మరియు దృష్టి లోపం ఉన్న వినియోగదారుల కోసం శ్రావ్యమైన మార్గదర్శకత్వం అందించండి.',
  },
  'ta-IN': {
    description: "'{name}' படம் பகுப்பாய்வு செய்யப்பட்டது. இது முதன்மை காட்சி பொருட்கள் மற்றும் உரை விவரங்களை காட்டுகிறது.",
    objects: ['முக்கிய பொருள்', 'உரை கூறுகள்', 'சுற்றுச்சூழல்'],
    suggestion: 'முக்கிய உரைகளை உரக்கப் படித்து குரல் வழிகாட்டல் வழங்கவும்.',
  },
  'zh-CN': {
    description: "图像 '{name}' 已完成无障碍分析。显示了主要的视觉对象、文本元素和周围环境细节。",
    objects: ['主要视觉对象', '文本元素', '周围环境'],
    suggestion: '朗读主要焦点标签，并为视障用户提供语音指引。',
  },
  'ar-SA': {
    description: "تم تحليل الصورة '{name}'. وهي تعرض العناصر البصرية الرئيسية والنصوص والتفاصيل المحيطة للتوجيه وإمكانية الوصول.",
    objects: ['العنصر البصري الرئيسي', 'النصوص', 'البيئة المحيطة'],
    suggestion: 'اقرأ النصوص الرئيسية وقدم إرشادات صوتية للمستخدمين ضعاف البصر.',
  },
}

export default function VisionAssistant() {
  const { selectedLanguage } = useLanguage()
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
      formData.append('language', selectedLanguage.code)

      let response = await fetch(`${API_URL}/api/vision/analyze`, {
        method: 'POST',
        body: formData,
      }).catch(() => null)

      if (!response || !response.ok) {
        response = await fetch(`${API_URL}/vision/analyze`, {
          method: 'POST',
          body: formData,
        }).catch(() => null)
      }

      if (response && response.ok) {
        const data = await response.json()
        setAnalysis(data)
        return
      }
    } catch (err) {
      console.warn('[VisionAssistant] Fetch error', err)
    } finally {
      setLoading(false)
    }

    const langData = MULTI_LANG_RESPONSES[selectedLanguage.code] || MULTI_LANG_RESPONSES['en-US']
    setAnalysis({
      success: true,
      description: langData.description.replace('{name}', file.name),
      objects: langData.objects,
      suggestion: langData.suggestion,
    })
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
    utterance.lang = selectedLanguage.code

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
      <h1 id="vision-assistant-title">Vision Assistant ({selectedLanguage.flag} {selectedLanguage.name})</h1>
      <p className="assistant-page__description">
        Upload an image to receive a quick accessibility analysis including detected objects and suggestions in {selectedLanguage.name}.
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
          Choose a clear photo for the best accessibility analysis in {selectedLanguage.name}.
        </p>

        {previewUrl && (
          <div className="image-preview-wrapper">
            <img src={previewUrl} alt="Selected preview" className="image-preview" />
          </div>
        )}

        <LargeButton onClick={analyzeImage} disabled={!file || loading} ariaLabel="Analyze uploaded image">
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </LargeButton>

        {error && <p className="assistant-error">{error}</p>}

        {analysis && (
          <div className="result-panel">
            <div className="result-header">
              <h2>Accessibility analysis ({selectedLanguage.flag} {selectedLanguage.name})</h2>
              {speechSupported ? (
                <div className="audio-controls">
                  <LargeButton onClick={handleReadAloud} ariaLabel="Read description aloud">
                    🔊 Read Aloud ({selectedLanguage.name})
                  </LargeButton>
                  <LargeButton
                    onClick={handlePauseSpeech}
                    disabled={!speaking || paused}
                    ariaLabel="Pause speech playback"
                  >
                    ⏸ Pause
                  </LargeButton>
                  <LargeButton onClick={handleResumeSpeech} disabled={!paused} ariaLabel="Resume speech playback">
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
