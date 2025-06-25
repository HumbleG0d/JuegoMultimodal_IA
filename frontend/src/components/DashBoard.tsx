import React, { useState, useRef, useEffect } from 'react';
import Button from './ui/Button';
import { Mic, Send, Save, MicOff } from 'lucide-react';
import type { Question , QuizResponse , SpeechRecognition , SpeechRecognitionErrorEvent , SpeechRecognitionEvent} from '../types';
import { useTranslation } from 'react-i18next';

// Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [prompt, setPrompt] = useState({
    description: '',
    age_group: '3-5 años',
  });

  // Verificar soporte para reconocimiento de voz al montar el componente
  useEffect(() => {
    const checkVoiceSupport = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setVoiceSupported(!!SpeechRecognition);
    };

    checkVoiceSupport();

    // Cleanup al desmontar
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'examTitle') {
      setExamTitle(value);
    } else {
      setPrompt((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVoiceInput = () => {
    if (!voiceSupported) {
      setError(t('dashboard.errors.voiceNotSupported') || 'El reconocimiento de voz no está soportado en este navegador');
      return;
    }

    if (isListening) {
      // Detener el reconocimiento
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Iniciar el reconocimiento
      startVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }
      
      const recognition = new SpeechRecognition();
      
      // Configuración del reconocimiento
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Eventos del reconocimiento
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Reconocimiento de voz iniciado');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        // Procesar todos los resultados
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        // Actualizar el prompt con el texto reconocido
        if (finalTranscript) {
          setPrompt(prev => ({
            ...prev,
            description: prev.description + (prev.description ? ' ' : '') + finalTranscript
          }));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            setError(t('dashboard.errors.noSpeech') || 'No se detectó habla. Intenta hablar más claro.');
            break;
          case 'audio-capture':
            setError(t('dashboard.errors.audioCapture') || 'No se pudo acceder al micrófono. Verifica los permisos.');
            break;
          case 'not-allowed':
            setError(t('dashboard.errors.microphonePermission') || 'Permisos de micrófono denegados. Habilita el acceso al micrófono.');
            break;
          case 'network':
            setError(t('dashboard.errors.networkError') || 'Error de red. Verifica tu conexión a internet.');
            break;
          default:
            setError(t('dashboard.errors.voiceRecognition') || 'Error en el reconocimiento de voz. Intenta nuevamente.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Reconocimiento de voz terminado');
      };

      // Guardar referencia y iniciar
      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      console.error('Error iniciando reconocimiento de voz:', error);
      setError(t('dashboard.errors.voiceInitError') || 'Error al inicializar el reconocimiento de voz');
      setIsListening(false);
    }
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

  const clearDescription = () => {
    setPrompt(prev => ({ ...prev, description: '' }));
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
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={prompt.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isListening ? 'border-red-500 bg-red-50' : ''
                    }`}
                    rows={4}
                    placeholder={t('dashboard.placeholders.description')}
                  />
                  {isListening && (
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-600 font-medium">
                        {t('dashboard.listening') || 'Escuchando...'}
                      </span>
                    </div>
                  )}
                </div>
                {prompt.description && (
                  <button
                    onClick={clearDescription}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    {t('dashboard.buttons.clearText') || 'Limpiar texto'}
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleVoiceInput}
                  variant={isListening ? 'secondary' : 'outline'}
                  className={`flex items-center gap-2 ${
                    !voiceSupported ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isListening ? 'bg-red-100 border-red-300 text-red-700' : ''}`}
                  disabled={!voiceSupported}
                  title={!voiceSupported ? 'Reconocimiento de voz no soportado' : ''}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
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
              <div className="text-red-500 text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {!voiceSupported && (
              <div className="text-amber-600 text-sm text-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                {t('dashboard.warnings.voiceNotSupported') || 'El reconocimiento de voz no está disponible en este navegador. Usa Chrome, Edge o Safari para obtener mejor compatibilidad.'}
              </div>
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