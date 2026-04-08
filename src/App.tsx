import { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Work } from './components/Work';
import { Footer } from './components/Footer';
import { ThemeProvider } from './ThemeContext';
import Bento from './components/About/Bento';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { CameraPermissionModal } from './components/CameraPermissionModal';
import { useFaceTracking } from './hooks/useFaceTracking';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Use the face tracking hook at the top level to manage permission state globally
  const { permissionRequested, requestPermission, denyPermission } = useFaceTracking();

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <CameraPermissionModal
          isOpen={!permissionRequested}
          onAllow={requestPermission}
          onDeny={denyPermission}
        />
        <main className="relative min-h-screen font-sans">
          <CustomCursor />
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Bento />
                <Experience />
                <Work />
              </>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
          </Routes>
          <Footer />
        </main>
      </Router>
    </ThemeProvider>
  );
}
