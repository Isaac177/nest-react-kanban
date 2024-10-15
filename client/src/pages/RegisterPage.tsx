import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationForm } from "../components/auth/RegistrationForm";
import LoadingBar from "react-top-loading-bar";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageToggle from "../components/toggles/LanguageToggle";
import { funnyQuotes } from "../data/funnyQuotes.tsx";
import ThemeToggle from "../components/toggles/ThemeToggle.tsx";



const QuoteDisplay = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funnyQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-6 text-white text-center text-xl font-bold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className='text-3xl font-bold'
        >
          {t(funnyQuotes[currentQuote])}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export const RegisterPageContent = () => {
  const [progress, setProgress] = useState(0);
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState(lang || 'en');

  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
      localStorage.setItem('language', lang);
      i18n.changeLanguage(lang);
    } else {
      const savedLang = localStorage.getItem('language') || 'en';
      setCurrentLang(savedLang);
      navigate(`/${savedLang}/register`, { replace: true });
    }
  }, [lang, navigate, i18n]);

  useEffect(() => {
    setProgress(30);
    const timer = setTimeout(() => setProgress(100), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 lg:grid-flow-col-dense xl:min-h-[800px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="hidden bg-muted lg:block h-full relative">
        <img
          src="https://picsum.photos/1920/1080"
          alt="Random image"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <QuoteDisplay />
      </div>
      <motion.div
        className="flex items-center justify-center py-12"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <RegistrationForm />
      </motion.div>
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageToggle />
        <ThemeToggle />
        <Button>
          <Link to={`/${currentLang}/login`} className="">
            {t('auth.signIn')}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

const RegisterPage = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  if (!pageLoaded) {
    return <LoadingBar color="green" progress={100} />;
  }

  return (
    <Suspense fallback={<LoadingBar color="green" progress={100} />}>
      <RegisterPageContent />
    </Suspense>
  );
};

export default RegisterPage;
