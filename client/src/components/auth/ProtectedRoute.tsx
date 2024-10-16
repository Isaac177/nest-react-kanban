import { Navigate, useParams } from 'react-router-dom';
import React from "react";
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const accessToken = localStorage.getItem('access_token');
    const { i18n } = useTranslation();
    const { lang } = useParams<{ lang: string }>();

    if (!accessToken) {
        return <Navigate to={`/${lang || i18n.language}/login`} replace />;
    }

    return children;
}
