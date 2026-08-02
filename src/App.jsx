import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import CommunicationAssistant from './pages/CommunicationAssistant'
import HearingAssistant from './pages/HearingAssistant'
import HomePage from './pages/HomePage'
import VisionAssistant from './pages/VisionAssistant'
import './styles/accessai.css'

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vision" element={<VisionAssistant />} />
          <Route path="/hearing" element={<HearingAssistant />} />
          <Route path="/communication" element={<CommunicationAssistant />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  )
}

export default App
