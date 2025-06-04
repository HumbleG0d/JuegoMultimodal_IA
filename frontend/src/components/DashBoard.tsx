import React, { useState } from 'react';
import Button from './ui/Button';
import { Mic, Send, Save} from 'lucide-react';
import type { Question , QuizResponse} from '../types';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState({
    description: '',
    age_group: '3-5 años', // Valor por defecto
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
    // Implementar lógica de reconocimiento de voz si es necesario
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
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
        throw new Error('Invalid response from server.');
      }

      console.log('Respuesta de la API:', data); // Depuración

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate questions.');
      }

      if (!data.success || !data.quiz_data?.questions) {
        throw new Error('Invalid quiz data received.');
      }

      // Mapear preguntas a la interfaz Question
      const questions: Question[] = data.quiz_data.questions.map((q, index) => ({
        id: `${data.quiz_data.quiz_id}-${index}`,
        question: q.question,
        options: q.options,
        correct_answer: q.options[q.correct_answer],
        explanation: q.explanation,
        type: 'multiple_choice',
      }));

      setGeneratedQuestions(questions);
      setExamTitle(data.quiz_data.title); // Usar el título generado
    } catch (err) {
      console.error('Error generando preguntas:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveExam = () => {
    console.log('Saving exam:', { title: examTitle, questions: generatedQuestions });
    // Implementar lógica para guardar en la base de datos
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
                name="examTitle"
                value={examTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter exam title"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="age_group" className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                id="age_group"
                name="age_group"
                value={prompt.age_group}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3-5 años">3-5 years</option>
                <option value="6-8 años">6-8 years</option>
                <option value="9-11 años">9-11 years</option>
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
                  placeholder="Describe the topic and type of questions you want to generate (e.g., 'One Piece characters')..."
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
                  disabled={isLoading || !prompt.description}
                >
                  <Send size={20} />
                  {isLoading ? 'Generating...' : 'Generate'}
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
                      <p className="text-sm font-medium text-gray-500">Explanation:</p>
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