import React, { useState, useEffect } from 'react';
import { Menu, X, TowerControl as GameController2 } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
        <a href="#" className="flex items-center gap-2">
          <GameController2 
            className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`} 
          />
          <span 
            className={`text-xl font-bold ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            EduGame AI
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`font-medium hover:text-blue-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button 
            variant={isScrolled ? 'primary' : 'outline'} 
            className={isScrolled ? '' : 'border-white text-white hover:bg-white/20'}
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className={`md:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-gray-800 font-medium py-2 hover:text-blue-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;