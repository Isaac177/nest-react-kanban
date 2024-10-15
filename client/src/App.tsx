import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from "./providers/QueryProvider";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <div className='flex-1 mx-auto bg-background'>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
      </TooltipProvider>
    </QueryProvider>
  );
}

export default App;
