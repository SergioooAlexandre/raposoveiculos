import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, PhoneCall, ShieldCheck, Car } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favoritesCount } = useFavorites();
  const { settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Estoque', path: '/estoque' },
    { name: 'Ofertas', path: '/ofertas' },
    { name: 'Favoritos', path: '/favoritos', badge: favoritesCount },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ];

  const whatsappPhone = cleanPhoneForWhatsApp(settings?.whatsapp || '5511999999999');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Olá! Vim pelo site da Raposo Veículos e gostaria de atendimento.')}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030303]/95 backdrop-blur-md border-b border-[#1F1F24] shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#030303] via-[#030303]/90 to-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-1.5">
                RAPOSO <span className="text-[#E11D48]">VEÍCULOS</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1 font-mono">
                Catálogo Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    isActive ? 'text-[#E11D48] font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E11D48] text-white">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E11D48] rounded-full shadow-[0_0_8px_#E11D48]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & WhatsApp CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/favoritos"
              aria-label="Ver Favoritos"
              className="relative p-2.5 rounded-xl bg-[#0A0A0C] border border-[#1F1F24] text-gray-300 hover:text-[#E11D48] hover:border-[#E11D48]/40 transition-all duration-200"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-[#E11D48] text-white border-2 border-[#030303]">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-sm font-semibold shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] transition-all duration-300 transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/favoritos"
              aria-label="Favoritos"
              className="relative p-2 rounded-lg bg-[#0A0A0C] border border-[#1F1F24] text-gray-300"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#E11D48] text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0A0A0C] border border-[#1F1F24] text-gray-300 hover:text-white"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] z-40 bg-[#030303]/98 backdrop-blur-2xl border-t border-[#1F1F24] p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30 font-semibold'
                      : 'text-gray-300 hover:bg-[#0A0A0C] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#E11D48] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#1F1F24] flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm shadow-lg shadow-green-900/30"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </a>

            <Link
              to="/admin/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-gray-500 hover:text-gray-300"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acesso Administrativo</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
