import React from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../constants';
import Icon from './ui/Icon';

const Features: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={feature.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div 
                className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                  index % 4 === 0 ? 'bg-blue-100 text-blue-600' :
                  index % 4 === 1 ? 'bg-purple-100 text-purple-600' :
                  index % 4 === 2 ? 'bg-pink-100 text-pink-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}
              >
                <Icon name={feature.icon} />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {t(`features.items.feature${index + 1}.title`)}
              </h3>
              
              <p className="text-gray-600">
                {t(`features.items.feature${index + 1}.description`)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t('features.integratedTitle')}
          </h3>
          <p className="max-w-2xl mx-auto">
            {t('features.integratedDescription')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;