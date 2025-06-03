import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Menu, X, TowerControl as GameController } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/#home" className="flex items-center gap-2">
          <GameController
            className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`}
            aria-hidden="true"
          />
          <span
            className={`text-xl font-bold ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            {t('header.brand')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className={`font-medium hover:text-blue-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {t(`header.nav.${link.id}`)}
            </Link>
          ))}
          <Button
            variant={isScrolled ? 'primary' : 'outline'}
            className={isScrolled ? '' : 'border-white text-white hover:bg-white/20'}
          >
            {t('header.nav.cta')}
          </Button>
          <div className="flex space-x-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={t('header.language.en')}
            >
              {t('header.language.en')}
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                i18n.language === 'es'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={t('header.language.es')}
            >
              {t('header.language.es')}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className={`md:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className="text-gray-800 font-medium py-2 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`header.nav.${link.id}`)}
              </Link>
            ))}
            <Button variant="primary" className="w-full">
              {t('header.nav.cta')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;