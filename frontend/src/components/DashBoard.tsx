import React, { useState } from 'react';
import Button from './ui/Button';
import { Mic, Send, Save} from 'lucide-react';
import type { Question , QuizResponse} from '../types';
import { useTranslation } from 'react-i18next';


const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState({
    description: '',
    age_group: '3-5 años',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'examTitle') {
      setExamTitle(value);
    } else {
      setPrompt((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('dashboard.errors.noToken'));
      }

      const response = await fetch('http://localhost:5000/api/teacher/dashboard/chat/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt.description,
          age_group: prompt.age_group,
        }),
      });

      let data: QuizResponse;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error(t('dashboard.errors.invalidResponse'));
      }

      console.log('Respuesta de la API:', data);

      if (!response.ok) {
        throw new Error(data.message || t('dashboard.errors.failedToGenerate'));
      }

      if (!data.success || !data.quiz_data?.questions) {
        throw new Error(t('dashboard.errors.invalidQuizData'));
      }

      const questions: Question[] = data.quiz_data.questions.map((q, index) => ({
        id: `${data.quiz_data.quiz_id}-${index}`,
        question: q.question,
        options: q.options,
        correct_answer: q.options[q.correct_answer],
        explanation: q.explanation,
        type: 'multiple_choice',
      }));

      setGeneratedQuestions(questions);
      setExamTitle(data.quiz_data.title);
    } catch (err) {
      console.error('Error generando preguntas:', err);
      setError(err instanceof Error ? err.message : t('dashboard.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const saveExam = () => {
    console.log('Saving exam:', { title: examTitle, questions: generatedQuestions });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="mb-6">
              <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.labels.examTitle')}
              </label>
              <input
                type="text"
                id="examTitle"
                name="examTitle"
                value={examTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('dashboard.placeholders.examTitle')}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="age_group" className="block text-sm font-medium text-gray-700 mb-2">
                {t('dashboard.labels.ageGroup')}
              </label>
              <select
                id="age_group"
                name="age_group"
                value={prompt.age_group}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3-5 años">{t('dashboard.ageGroups.3_5_years')}</option>
                <option value="6-8 años">{t('dashboard.ageGroups.6_8_years')}</option>
                <option value="9-11 años">{t('dashboard.ageGroups.9_11_years')}</option>
              </select>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <textarea
                  id="description"
                  name="description"
                  value={prompt.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder={t('dashboard.placeholders.description')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleVoiceInput}
                  variant={isListening ? 'secondary' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <Mic size={20} />
                  {isListening ? t('dashboard.buttons.stop') : t('dashboard.buttons.voice')}
                </Button>
                <Button
                  onClick={generateQuestions}
                  variant="primary"
                  className="flex items-center gap-2"
                  disabled={isLoading || !prompt.description}
                >
                  <Send size={20} />
                  {isLoading ? t('dashboard.buttons.generating') : t('dashboard.buttons.generate')}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}
          </div>
          
          {generatedQuestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.generatedQuestions')}</h2>
                <Button
                  onClick={saveExam}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <Save size={20} />
                  {t('dashboard.buttons.saveExam')}
                </Button>
              </div>
              
              <div className="space-y-6">
                {generatedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-medium text-gray-800">{question.question}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 text-black rounded-lg border ${
                            option === question.correct_answer
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">{t('dashboard.question.explanation')}</p>
                      <p className="text-gray-700 mt-1">{question.explanation}</p>
                    </div>
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

export default Dashboard;