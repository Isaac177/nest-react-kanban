import { Navigate } from 'react-router-dom';
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
