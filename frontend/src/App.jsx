// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { NotFoundPage } from './pages/NotFoundPage'
import Header from './components/Header'
import ToastContainer from './components/ToastContainer'

function App() {
  // Убрали тестовую ошибку Rollbar, чтобы не мешать автоматическим тестам

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
