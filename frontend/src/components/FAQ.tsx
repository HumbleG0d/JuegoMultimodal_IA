import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FAQ_ITEMS } from '../constants';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq.description')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    {t(`faq.items.item${index + 1}.question`)}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="flex-shrink-0 text-blue-500" size={20} />
                  ) : (
                    <ChevronDown className="flex-shrink-0 text-gray-500" size={20} />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">
                      {t(`faq.items.item${index + 1}.answer`)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              {t('faq.stillHaveQuestions')}
            </p>
            <a 
              href="#" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              {t('faq.contactLink')}
              <ChevronDown size={16} className="ml-1 transform rotate-270" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;