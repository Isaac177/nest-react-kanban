import React, { useState, useEffect, Suspense } from 'react'
import { LoginForm } from "../components/auth/LoginForm.tsx";
import LoadingBar from "react-top-loading-bar";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LoginPageContent() {
  const [progress, setProgress] = useState(0)
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
    } else if (!lang) {
      const savedLang = localStorage.getItem('language') || 'en';
      navigate(`/${savedLang}/login`, { replace: true });
    }
  }, [lang, i18n, navigate]);

  useEffect(() => {
    setProgress(30)
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 lg:grid-flow-col-dense xl:min-h-[800px]">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="hidden bg-muted lg:block h-full">
        <img
          src="https://picsum.photos/1920/1080"
          alt="Random image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <LoginForm />
      </div>
    </div>
  )
}

export function LoginPage() {
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    setPageLoaded(true)
  }, [])

  if (!pageLoaded) {
    return <LoadingBar color="#f11946" progress={100} />
  }

  return (
    <Suspense fallback={<LoadingBar color="#f11946" progress={100} />}>
      <LoginPageContent />
    </Suspense>
  )
}
