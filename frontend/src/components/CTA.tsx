import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative px-6 py-12 md:p-12 lg:p-16 text-center md:text-left">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-white blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {t('cta.title')}
                </h2>
                <p className="text-xl text-white/90 mb-6 max-w-2xl">
                  {t('cta.description')}
                </p>
                
                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto md:mx-0">
                  <input 
                    type="email" 
                    placeholder={t('cta.emailPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <Button className="bg-opacity-10 text-blue-600 hover:bg-blue-50">
                    {t('cta.buttonText')} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
                
                <p className="mt-4 text-white/80 text-sm">
                  {t('cta.waitlistText')}
                </p>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-white mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t('cta.benefitsTitle')}
                    </h3>
                    <ul className="space-y-2 text-white/90">
                      {[
                        t('cta.benefitsList.item1'),
                        t('cta.benefitsList.item2'),
                        t('cta.benefitsList.item3'),
                        t('cta.benefitsList.item4')
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-300 mr-2">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-white/20 rounded-lg">
                    <p className="text-white text-sm italic">
                      {t('cta.testimonial')}
                    </p>
                    <p className="text-white/80 text-xs mt-2">
                      {t('cta.testimonialAuthor')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;