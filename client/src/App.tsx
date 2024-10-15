import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QueryProvider } from "./providers/QueryProvider";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "react-hot-toast";

function LanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);

    if (location.pathname === '/') {
      navigate(`/${savedLanguage}/login`, { replace: true });
    } else {
      const newPath = `/${savedLanguage}${location.pathname}`;
      navigate(newPath, { replace: true });
    }
  }, [navigate, i18n, location]);

  return null;
}

function App() {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <div className='flex-1 mx-auto bg-background'>
          <Router>
            <Routes>
              <Route path="/" element={<LanguageRedirect />} />
              <Route path="/:lang">
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                  path="dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<LanguageRedirect />} />
            </Routes>
          </Router>
        </div>
      </TooltipProvider>
    </QueryProvider>
  );
}

export default App;
