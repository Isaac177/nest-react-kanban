import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { useLogin } from "../../hooks/useLogin.ts";
import { LoginValidationErrors, validateLoginForm } from "../../validators/loginValidator.ts";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginValidationErrors>({});
    const { login, isLoading, isError, error:apiError } = useLogin();

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
      <div className="flex min-h-screen">
          <div className="flex-1 flex justify-center items-center">
              <Card className="w-[400px]">
                  <CardHeader>
                      <CardTitle className="text-2xl">Welcome to NoteKeeper</CardTitle>
                      <CardDescription>Sign in to access your notes</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium">
                                  Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                          </div>
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          <div className="space-y-2">
                              <Label htmlFor="password" className="text-sm font-medium">
                                  Password
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                          </div>
                          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                          {isError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {apiError instanceof Error ? apiError.message : 'An error occurred'}
                                </AlertDescription>
                            </Alert>
                          )}
                          <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading}
                          >
                              {isLoading ? 'Signing In...' : 'Sign In'}
                          </Button>
                      </form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                      <Button variant="link" className="w-full">
                          Forgot password?
                      </Button>
                      <div className="text-sm text-center">
                          Don't have an account?{' '}
                          <Link to="/register" className="text-blue-600 hover:underline">
                              Register here
                          </Link>
                      </div>
                  </CardFooter>
              </Card>
              <Toaster />
          </div>
      </div>
    );
}
