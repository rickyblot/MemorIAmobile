
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { SubscriptionAuthProvider } from '@/contexts/SubscriptionAuthContext.jsx';
import { DeviceDetectionProvider } from '@/contexts/DeviceDetectionContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { LOGIN_PATH, PLANS_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SmartAlbumPage from './pages/SmartAlbumPage.jsx';
import PlansPage from './pages/PlansPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import SubscriptionsPage from './pages/SubscriptionsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BlogList from './pages/admin/BlogList.jsx';
import BlogCreate from './pages/admin/BlogCreate.jsx';
import BlogEdit from './pages/admin/BlogEdit.jsx';
import BlogIndex from './pages/blog/BlogIndex.jsx';
import BlogDetail from './pages/blog/BlogDetail.jsx';

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <SubscriptionAuthProvider>
        <DeviceDetectionProvider>
          <LanguageProvider>
            <Router>
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
              <Toaster position="bottom-center" theme="light" />
            </Router>
          </LanguageProvider>
        </DeviceDetectionProvider>
      </SubscriptionAuthProvider>
    </AuthProvider>
  );
}

export default App;
