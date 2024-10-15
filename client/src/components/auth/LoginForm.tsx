import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { useLogin } from "../../hooks/useLogin";
import { LoginValidationErrors, validateLoginForm } from "../../validators/loginValidator";

export function LoginForm() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginValidationErrors>({});
    const { login, isLoading, isError, error: apiError } = useLogin();
    const [currentLang, setCurrentLang] = useState(i18n.language);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') || 'en';
        setCurrentLang(savedLang);
        i18n.changeLanguage(savedLang);
    }, [i18n]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLoginForm({ email, password });
        if (Object.keys(validationErrors).length === 0) {
            login({ email, password });
        } else {
            setErrors(validationErrors);
        }
    };

    return (
      <div className="flex min-h-screen flex-col">
          <div className="flex-1 flex justify-center items-center">
              <Card className="w-[400px]">
                  <CardHeader>
                      <CardTitle className="text-2xl">{t('auth.welcome')}</CardTitle>
                      <CardDescription>{t('auth.signInDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
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
                              {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{t(errors.password)}</p>
                              )}
                          </div>
                          {isError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {apiError instanceof Error ? t(apiError.message) : t('auth.genericError')}
                                </AlertDescription>
                            </Alert>
                          )}
                          <Button className="w-full" type="submit" disabled={isLoading}>
                              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
                          </Button>
                      </form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                      <Button variant="link" className="w-full">
                          {t('auth.forgotPassword')}
                      </Button>
                      <div className="text-sm text-center">
                          {t('auth.noAccount')}{' '}
                          <Link to={`/${currentLang}/register`} className="text-blue-600 hover:underline">
                              {t('auth.registerHere')}
                          </Link>
                      </div>
                  </CardFooter>
              </Card>
              <Toaster />
          </div>
      </div>
    );
}
