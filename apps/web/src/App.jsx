
import React, { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { SubscriptionAuthProvider } from '@/contexts/SubscriptionAuthContext.jsx';
import { DeviceDetectionProvider } from '@/contexts/DeviceDetectionContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { LOGIN_PATH, PLANS_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';

import HomePage from './pages/HomePage.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const SmartAlbumPage = lazy(() => import('./pages/SmartAlbumPage.jsx'));
const MemoriesPage = lazy(() => import('./pages/MemoriesPage.jsx'));
const PlansPage = lazy(() => import('./pages/PlansPage.jsx'));
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const BlogList = lazy(() => import('./pages/admin/BlogList.jsx'));
const BlogCreate = lazy(() => import('./pages/admin/BlogCreate.jsx'));
const BlogEdit = lazy(() => import('./pages/admin/BlogEdit.jsx'));
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex.jsx'));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail.jsx'));

import { Toaster } from 'sonner';

function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-busy="true" />;
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionAuthProvider>
        <DeviceDetectionProvider>
          <LanguageProvider>
            <Router>
              <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                
                {/* Subscription Routes */}
                <Route path={LOGIN_PATH} element={<LoginPage />} />
                <Route path={PLANS_PATH} element={<PlansPage />} />
                <Route path={MANAGE_PATH} element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/dashboard/albums/:albumType" element={<ProtectedRoute><SmartAlbumPage /></ProtectedRoute>} />
                <Route path="/memories" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
                <Route path="/admin/blog" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
                <Route path="/admin/blog/new" element={<ProtectedRoute><BlogCreate /></ProtectedRoute>} />
                <Route path="/admin/blog/:id/edit" element={<ProtectedRoute><BlogEdit /></ProtectedRoute>} />

                {/* Catch All */}
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center px-4">
                    <h1 className="text-6xl font-heading font-extrabold mb-4 text-primary">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">Esta página no existe o fue movida.</p>
                    <a href="/" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold transition-colors">
                      Volver al inicio
                    </a>
                  </div>
                } />
              </Routes>
              </Suspense>
              <Toaster position="bottom-center" theme="light" />
            </Router>
          </LanguageProvider>
        </DeviceDetectionProvider>
      </SubscriptionAuthProvider>
    </AuthProvider>
  );
}

export default App;
