import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import { QueryProvider } from "./providers/QueryProvider.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";



function App() {
  return (
    <QueryProvider>
      <div className='flex-1 mx-auto'>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </QueryProvider>
  )
}

export default App
