import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import CookieConsent from '@/components/CookieConsent';
import Home from '@/pages/Home';

const Services = lazy(() => import('@/pages/Services'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Process = lazy(() => import('@/pages/Process'));
const Contact = lazy(() => import('@/pages/Contact'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/Terms'));
const PaymentsRefunds = lazy(() => import('@/pages/PaymentsRefunds'));
const Blog = lazy(() => import('@/pages/Blog'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-[100dvh] bg-white text-slate-900">
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/process" element={<Process />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/payments-and-refunds" element={<PaymentsRefunds />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Suspense>
        <Footer />
        <CookieConsent />
      </div>
    </LanguageProvider>
  );
}
