import React from 'react';
import { TowerControl as GameController2, Twitter, Facebook, Instagram, Mail, Github } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GameController2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">EduGame AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionizing educational gaming through AI-powered multimodal learning experiences.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Facebook, Instagram, Github].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label={`Social media link ${i+1}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.id}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Documentation", "API", "Tutorials", "Blog", "Case Studies"].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="text-gray-400 mr-2" />
                <a 
                  href="mailto:info@edugame-ai.example.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@edugame-ai.example.com
                </a>
              </li>
              <li className="text-gray-400 mt-4">
                <p>123 Education Lane</p>
                <p>San Francisco, CA 94103</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} EduGame AI. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;