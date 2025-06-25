import React from 'react';
import { useTranslation } from 'react-i18next';
import { HOW_IT_WORKS_STEPS } from '../constants';
import Icon from './ui/Icon';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 -translate-x-1/2 z-0"></div>
          
          <div className="space-y-12 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center`}
              >
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                    {t(`howItWorks.steps.step${step.id}.title`)}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {t(`howItWorks.steps.step${step.id}.description`)}
                  </p>
                </div>
                
                <div className="my-6 lg:my-0 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg relative z-10">
                    <Icon name={step.icon} />
                  </div>
                </div>
                
                <div className="lg:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 bg-gray-50 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                  <h3 className="text-xl text-white font-medium mb-4">
                    {t('howItWorks.example.title')}
                  </h3>
                  
                  <div 
                    className="bg-white/10 backdrop-blur-sm p-3 rounded-md text-white mb-3"
                    dangerouslySetInnerHTML={{ __html: t('howItWorks.example.playerMessage') }}
                  />
                  
                  <div 
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-md text-white mb-3"
                    dangerouslySetInnerHTML={{ __html: t('howItWorks.example.aiResponse') }}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-white/80">
                      {t('howItWorks.example.analyzingText')}
                    </span>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map(i => (
                        <div 
                          key={i}
                          className="w-2 h-2 bg-white rounded-full animate-pulse" 
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-pink-500 text-white p-2 rounded-md text-sm shadow-md transform rotate-3">
                  {t('howItWorks.example.generatingText')}
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {t('howItWorks.adaptation.title')}
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                {t('howItWorks.adaptation.description')}
              </p>
              <ul className="space-y-3">
                {(t('howItWorks.adaptation.features', { returnObjects: true }) as string[]).map((item: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;