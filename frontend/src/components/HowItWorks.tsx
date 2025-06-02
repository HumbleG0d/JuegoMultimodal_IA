import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../constants';
import Icon from './ui/Icon';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            How AI Powers Your Learning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI engine creates a truly personalized experience by analyzing
            your interactions and generating custom content in real-time.
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
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {step.description}
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
                  <h3 className="text-xl text-white font-medium mb-4">AI Response Example</h3>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-md text-white mb-3">
                    <p className="text-sm"><strong>Player:</strong> I'm having trouble understanding fractions.</p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-md text-white mb-3">
                    <p className="text-sm"><strong>AI:</strong> I notice you're visual-tactile learner. Let's create a pizza fraction game where you can slice and combine pieces...</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-white/80">Analyzing learning style...</span>
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
                  Generating personalized content
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Real-Time AI Adaptation
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                As you interact with the game, our AI constantly analyzes your responses,
                engagement patterns, and learning progress to create a truly personalized
                experience.
              </p>
              <ul className="space-y-3">
                {[
                  "Identifies your preferred learning modalities",
                  "Adjusts difficulty based on your progress",
                  "Creates custom narratives that resonate with your interests",
                  "Provides targeted support where you need it most"
                ].map((item, i) => (
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