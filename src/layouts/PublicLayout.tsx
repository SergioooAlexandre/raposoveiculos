import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-between selection:bg-[#E11D48] selection:text-white">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};
