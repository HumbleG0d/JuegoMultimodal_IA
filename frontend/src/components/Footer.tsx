import React from 'react';
import { useTranslation } from 'react-i18next';
import { TowerControl as GameController, Twitter, Facebook, Instagram, Mail, Github } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

   const socialIcons = [Twitter, Facebook, Instagram, Github];
   const SOCIAL_LINKS = [
     { id: 'twitter', href: 'https://twitter.com/' },
     { id: 'facebook', href: 'https://facebook.com/' },
     { id: 'instagram', href: 'https://instagram.com/' },
     { id: 'github', href: 'https://github.com/' },
   ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GameController className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{t('footer.brand')}</span>
            </div>
            <p className="text-gray-400 mb-4">{t('footer.description')}</p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link, i) => {
                const Icon = socialIcons[i];
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={t(`footer.social.${link.id}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.sections.navigation')}</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(`footer.navLinks.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.sections.resources')}</h3>
            <ul className="space-y-2">
              {['documentation', 'api', 'tutorials', 'blog', 'caseStudies'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(`footer.resources.${item}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.sections.contact')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="text-gray-400 mr-2" />
                <a
                  href={`mailto:${t('footer.contact.email')}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('footer.contact.email')}
                </a>
              </li>
              <li className="text-gray-400 mt-4">
                <p>{t('footer.contact.address.line1')}</p>
                <p>{t('footer.contact.address.line2')}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {['privacy', 'terms', 'cookies'].map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t(`footer.links.${item}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;