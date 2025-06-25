import type { Questionprompt, Quiz} from "../types";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ViewQuizGenerate: React.FC = () => {
  const [generatedQuestions, setGeneratedQuestions] = useState<Questionprompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { quizId } = useParams<{ quizId: string }>();

  const getQuizzId = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('dashboard.error.noToken'));
      }
      console.log("ID---->", id);
      const response = await fetch(`http://localhost:5000/api/teacher/dashboard/quiz/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      let rawData: { quiz: Quiz[] };
      try {
        rawData = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error(t('dashboard.error.invalidJson'));
      }

      console.log("Respuesta de la API:", rawData);

      if (!response.ok) {
        throw new Error(t('dashboard.error.fetchQuiz'));
      }
        const data = rawData.quiz[0];
        const questions: Questionprompt[] = data.quiz_data.questions.map((question, index) => ({
            id: `question-${index + 1}`,
            correct_answer: question.options[question.correct_answer], // Convertir índice a valor string
            explanation: question.explanation,
            options: question.options,
            question: question.question,
        }));
    setGeneratedQuestions(questions);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError(error instanceof Error ? error.message : t('dashboard.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      getQuizzId(quizId);
    } else {
      setError(t('dashboard.error.noQuizId'));
    }
  }, [quizId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Generado</h1>
          <p className="text-white/70">Revisa las preguntas y respuestas del quiz</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl text-center mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white/70 text-lg">{t('dashboard.loading')}</p>
          </div>
        ) : generatedQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/70 text-lg">{t('dashboard.noQuestions')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {generatedQuestions.map((question, questionIndex) => (
              <div
                key={question.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* Número de pregunta y título */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                      Pregunta {questionIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white leading-relaxed">
                    {question.question}
                  </h3>
                </div>

                {/* Opciones */}
                <div className="space-y-3 mb-6">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = option === question.correct_answer; // Comparar valor string
                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          isCorrect
                            ? 'border-green-400 bg-green-500/20 text-green-100 shadow-md shadow-green-500/20'
                            : 'border-white/20 bg-white/5 text-white/90 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCorrect 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white/20 text-white/70'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="flex-1 text-base">{option}</span>
                          {isCorrect && (
                            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explicación */}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-lg p-2">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">
                        {t('dashboard.question.explanation')}
                      </h4>
                      <p className="text-white/90 text-base leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuizGenerate;