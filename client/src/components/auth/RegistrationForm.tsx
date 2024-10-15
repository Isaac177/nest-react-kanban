import React, { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from "../../hooks/useRegister";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { validateRegisterForm, ValidationErrors } from "../../validators/registerFormValidators";
import i18n from "../../i18n.ts";

export function RegistrationForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { register, isLoading, isError, error } = useRegister();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setCurrentLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm({ username, email, password, confirmPassword });
    if (Object.keys(validationErrors).length === 0) {
      register({ username, email, password });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.createAccount')}</CardTitle>
            <CardDescription>{t('auth.signUpDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t('auth.username')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{t(errors.username)}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{t(errors.email)}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{t(errors.password)}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{t(errors.confirmPassword)}</p>}
              </div>
              {isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error instanceof Error ? t(error.message) : t('auth.genericError')}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? t('auth.signingUp') : t('auth.signUp')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              {t('auth.haveAccount')}{' '}
              <Link to={`/${currentLang}/login`} className="text-blue-600 hover:underline">
                {t('auth.signInHere')}
              </Link>
            </div>
          </CardFooter>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
