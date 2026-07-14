import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Loader2, CheckCircle2, XCircle, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const reqs = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(reqs).every(Boolean);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await apiServerClient.fetch('/auth/validate-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('This reset link has expired. Request a new one.');
        }

        setIsTokenValid(true);
      } catch (err) {
        setTokenError(err.message);
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenError('No reset token provided.');
      setIsValidating(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isPasswordValid) {
      setFormError('Password does not meet requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiServerClient.fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm: confirmPassword }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error(data.error || 'Invalid or expired token.');
        } else if (response.status === 422) {
          throw new Error(data.error || 'Password does not meet requirements.');
        } else {
          throw new Error(data.error || 'Failed to reset password. Please try again.');
        }
      }

      toast({
        title: 'Success',
        description: 'Password reset successfully. Redirecting to login...',
      });

      setTimeout(() => {
        navigate(LOGIN_PATH);
      }, 2000);

    } catch (err) {
      setFormError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRequirement = (label, met) => (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? 'text-primary' : 'text-muted-foreground'}`}>
      {met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Create New Password - MemorIA</title>
        <meta name="description" content="Create a new secure password for your account" />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-lg p-8 border border-border">
            
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Validating secure link...</p>
              </div>
            ) : !isTokenValid ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h1>
                  <p className="text-muted-foreground text-sm">{tokenError}</p>
                </div>
                <Button asChild className="w-full font-bold h-12 text-base font-sans">
                  <Link to="/reset-password">Request New Reset Link</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2 font-sans tracking-tight">
                    Create New Password
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your new secure password below.
                  </p>
                </div>

                {formError && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{formError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-foreground font-semibold">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background border-border text-foreground h-12"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="bg-muted/40 p-4 rounded-xl border border-border/60 space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Password Requirements</p>
                    <div className="grid grid-cols-2 gap-2">
                      {renderRequirement('At least 8 characters', reqs.length)}
                      {renderRequirement('One uppercase letter', reqs.uppercase)}
                      {renderRequirement('One number', reqs.number)}
                      {renderRequirement('One special character', reqs.special)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-foreground font-semibold">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background border-border text-foreground h-12"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isPasswordValid || password !== confirmPassword}
                    className="w-full font-bold h-12 text-base font-sans shadow-sm"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </>
            )}

            {!isValidating && (
              <div className="mt-8 text-center pt-6 border-t border-border">
                <Link to={LOGIN_PATH} className="inline-flex items-center text-muted-foreground hover:text-primary font-semibold transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}