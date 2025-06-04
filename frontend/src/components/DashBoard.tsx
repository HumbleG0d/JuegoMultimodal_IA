import React, { useState } from 'react';
import Button from './ui/Button';
import { Mic, Send, Save, Plus, Trash2 } from 'lucide-react';
import type { Question } from '../types';

const DashBoard: React.FC = () => {

  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  const generateQuestions = async () => {
    // This would connect to your AI service
    const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'What is the capital of France?',
        type: 'multiple_choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris'
      },
      {
        id: '2',
        text: 'Explain the process of photosynthesis.',
        type: 'open_ended',
        correctAnswer: 'Photosynthesis is the process by which plants convert light energy into chemical energy.'
      }
    ];
    
    setGeneratedQuestions(mockQuestions);
  };

  const saveExam = () => {
    // Save exam to database logic would go here
    console.log('Saving exam:', { title: examTitle, questions: generatedQuestions });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Exam Questions</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title
              </label>
              <input
                type="text"
                id="examTitle"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter exam title"
              />
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the topic and type of questions you want to generate..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleVoiceInput}
                  variant={isListening ? 'secondary' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <Mic size={20} />
                  {isListening ? 'Stop' : 'Voice'}
                </Button>
                <Button
                  onClick={generateQuestions}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Send size={20} />
                  Generate
                </Button>
              </div>
            </div>
          </div>
          
          {generatedQuestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
                <Button
                  onClick={saveExam}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Save size={20} />
                  Save Exam
                </Button>
              </div>
              
              <div className="space-y-6">
                {generatedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-800">
                        Question {index + 1}
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-blue-500">
                          <Plus size={20} />
                        </button>
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{question.text}</p>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 text-black rounded-lg border ${
                              option === question.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'open_ended' && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-500">Sample Answer:</p>
                        <p className="text-gray-700 mt-1">{question.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;