import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';
import { MailCheck, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export default function PasswordResetPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
      setSubmitted(true);
      toast.success('Reset instructions sent to your email');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{t('auth.reset.title')} - MemorIA</title></Helmet>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-muted/30">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-sm p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold font-sans tracking-tight">{t('auth.reset.title')}</h1>
            <p className="text-muted-foreground text-sm mt-2">{submitted ? t('auth.reset.success') : t('auth.reset.subtitle')}</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">{t('auth.reset.email')}</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="h-12" />
              </div>
              <Button type="submit" className="w-full font-bold h-12 text-base" disabled={loading}>
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : t('auth.reset.submit')}
              </Button>
              <div className="text-center pt-4">
                <Link to={LOGIN_PATH} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded outline-none px-2 py-1">
                  <ArrowLeft className="w-4 h-4 mr-2" /> {t('auth.reset.back')}
                </Link>
              </div>
            </form>
          ) : (
             <Button variant="outline" className="w-full h-12 font-bold text-base" asChild>
               <Link to={LOGIN_PATH}>{t('auth.reset.back')}</Link>
             </Button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}