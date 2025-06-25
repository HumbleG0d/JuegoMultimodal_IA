import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './ui/Button';
import { ChevronRight, Sparkles, Brain, Mic } from 'lucide-react';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
              <Sparkles size={16} className="mr-2" aria-hidden="true" />
              <span>{t('hero.badge.text')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="block mb-2">{t('hero.title.main')}</span>
              <span className="block mb-2 text-pink-300">{t('hero.title.highlight')}</span>
              <span className="block">{t('hero.title.sub')}</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
              {t('hero.description')}
            </p>
          </div>
          
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main illustration containing game elements and AI visualization */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 overflow-hidden relative">
                  {/* Game visualization placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                      <Brain size={32} className="text-white" aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* Voice interaction visualization */}
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                    <Mic size={16} className="text-white mr-2 animate-pulse" aria-hidden="true" />
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i}
                          className="bg-white h-3 w-1 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-white font-medium">
                    <p className="opacity-90">{t('hero.visualization.progressLabel')}</p>
                    <div className="w-32 h-2 bg-white/20 rounded-full mt-1">
                      <div className="w-3/4 h-full bg-pink-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="text-white text-right">
                    <p className="opacity-90">{t('hero.visualization.adaptingLabel')}</p>
                    <div className="flex justify-end space-x-1 mt-1">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="h-2 w-2 bg-green-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-blue-500 rounded-lg p-4 shadow-lg rotate-6 transform hover:rotate-0 transition-transform">
                <p className="text-white text-sm">{t('hero.visualization.challengeText')}</p>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-purple-500 rounded-lg p-3 shadow-lg -rotate-3 transform hover:rotate-0 transition-transform">
                <p className="text-white text-xs">{t('hero.visualization.styleText')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80">
          <p className="text-sm mb-2">{t('hero.scrollIndicator')}</p>
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;