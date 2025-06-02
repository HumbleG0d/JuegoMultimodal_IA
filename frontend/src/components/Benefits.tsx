import React from 'react';
import { BENEFITS } from '../constants';
import Icon from './ui/Icon';

const Benefits: React.FC = () => {
  return (
    <section id="benefits" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Benefits of AI-Powered Multimodal Learning
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our approach transforms traditional educational gaming into a personalized
            experience that adapts to each learner's unique needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div 
              key={benefit.id}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="flex items-start">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0
                  ${index % 4 === 0 ? 'bg-blue-600' : 
                    index % 4 === 1 ? 'bg-purple-600' : 
                    index % 4 === 2 ? 'bg-pink-600' : 
                    'bg-indigo-600'}
                `}>
                  <Icon name={benefit.icon} className="text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4">
                  See the Impact on Learning Outcomes
                </h3>
                <p className="text-lg mb-4">
                  Studies show that multimodal learning experiences combined with AI-personalization
                  can significantly improve engagement, retention, and knowledge transfer.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Engagement", value: "78%" },
                    { label: "Retention", value: "65%" },
                    { label: "Completion", value: "92%" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm text-white/80">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-center mb-3">
                    <p className="text-sm text-white/80">Improvement Over Traditional Methods</p>
                  </div>
                  
                  <div className="relative h-40">
                    {/* Simple chart visualization */}
                    <div className="absolute bottom-0 left-0 w-1/3 bg-blue-400 rounded-t-md" style={{ height: '40%' }}>
                      <div className="text-xs text-center pt-2">Standard</div>
                    </div>
                    <div className="absolute bottom-0 left-1/3 w-1/3 bg-purple-400 rounded-t-md" style={{ height: '60%' }}>
                      <div className="text-xs text-center pt-2">Digital</div>
                    </div>
                    <div className="absolute bottom-0 left-2/3 w-1/3 bg-pink-400 rounded-t-md" style={{ height: '85%' }}>
                      <div className="text-xs text-center pt-2">AI Multimodal</div>
                    </div>
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

export default Benefits;