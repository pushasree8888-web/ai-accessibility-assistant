import { createContext, useContext, useState } from 'react'

export const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'zh-CN', name: '中文 (Mandarin)', flag: '🇨🇳' },
  { code: 'ar-SA', name: 'العربية (Arabic)', flag: '🇸🇦' },
]

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0])

  const changeLanguage = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
    setSelectedLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ selectedLanguage, changeLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      selectedLanguage: LANGUAGES[0],
      changeLanguage: () => {},
      LANGUAGES,
    }
  }
  return context
}
