import type { Question } from "../types";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, X, ArrowRight, RotateCcw, Trophy, Loader2, ArrowLeft } from 'lucide-react';

interface QuizData {
  age_group: string;
  created_at: string;
  created_by: number;
  original_prompt: string;
  questions: {
    correct_answer: number;
    explanation: string;
    options: string[];
    question: string;
  }[];
  title: string;
  topic: string;
}

interface QuizResponse {
  quiz: {
    created_at: string;
    id: string;
    nombre: string;
    quiz_data: QuizData;
    user_id: number;
  }[];
}

const PlayQuizz: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [quizTitle, setQuizTitle] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [botEmotion, setBotEmotion] = useState('neutral');
    const [botMessage, setBotMessage] = useState('');
    const [showBotMessage, setShowBotMessage] = useState(false);

    useEffect(() => {
    const fetchQuizData = async () => {
        if (!quizId || quizId === 'undefined') {
            setError('ID del quiz no proporcionado o inválido');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const url = `http://localhost:5000/api/student/dashboard/quiz/${quizId}`;
            console.log('🚀 Fetching URL:', url);
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            };
            console.log('📋 Headers:', headers);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                credentials: 'include',
            });
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);
            console.log('📡 Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            
            const data: QuizResponse = await response.json();
            console.log('✅ Quiz data received:', data);
            
            if (!data.quiz || data.quiz.length === 0) {
                throw new Error('No se encontró el quiz');
            }
            
            const quizData = data.quiz[0];
            setQuizTitle(quizData.nombre);
            
            // Transform API questions to component format
            const transformedQuestions: Question[] = quizData.quiz_data.questions.map((q, index) => ({
                id: `${quizData.id}-${index}`,
                question: q.question,
                options: q.options,
                correct_answer: q.options[q.correct_answer],
                explanation: q.explanation,
                type: 'multiple_choice',
            }));
            
            console.log('✅ Transformed questions:', transformedQuestions);
            setQuestions(transformedQuestions);
            
        } catch (err) {
            console.error('❌ Error fetching quiz:', err);
            console.error('❌ Error stack:', err instanceof Error ? err.stack : 'No stack');
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar el quiz');
        } finally {
            setLoading(false);
        }
    };

    fetchQuizData();
}, [quizId]);

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null || questions.length === 0) return;
        
        setSelectedAnswer(answerIndex);
        
        // Find correct answer by comparing with the stored correct_answer string
        const currentQuestionData = questions[currentQuestion];
        const correct = currentQuestionData.options[answerIndex] === currentQuestionData.correct_answer;
        
        setIsCorrect(correct);
        
        if (correct) {
            setScore(score + 1);
            setBotEmotion('happy');
        } else {
            setBotEmotion('sad');
        }
        
        setBotMessage(currentQuestionData.explanation);
        setShowBotMessage(true);
        setShowResult(true);
    };
    
    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setShowBotMessage(false);
            setIsCorrect(null);
            setBotEmotion('neutral');
            setBotMessage('');
        } else {
            setQuizCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setQuizCompleted(false);
        setShowBotMessage(false);
        setIsCorrect(null);
        setBotEmotion('neutral');
        setBotMessage('');
    };

    const getBotFace = () => {
        switch(botEmotion) {
            case 'happy':
                return '😊';
            case 'sad':
                return '😔';
            case 'excited':
                return '🤩';
            default:
                return '🤖';
        }
    };

    const getCorrectAnswerIndex = () => {
        if (questions.length === 0 || currentQuestion >= questions.length) return -1;
        const currentQuestionData = questions[currentQuestion];
        return currentQuestionData.options.findIndex((option: string) => option === currentQuestionData.correct_answer);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <Loader2 className="w-12 h-12 text-white mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold text-white mb-2">Cargando Quiz...</h2>
                    <p className="text-purple-100">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error al cargar</h2>
                    <p className="text-purple-100 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // No questions available
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-2">No hay preguntas disponibles</h2>
                    <p className="text-purple-100">Este quiz no contiene preguntas.</p>
                </div>
            </div>
        );
    }

    const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;
    const correctAnswerIndex = getCorrectAnswerIndex();

    // Quiz completed state
    if (quizCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <div className="mb-6">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">¡Quiz Completado!</h2>
                        <p className="text-purple-100">Has terminado: {quizTitle}</p>
                    </div>
                    
                    <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/10">
                        <div className="text-4xl font-bold text-white mb-2">{score}/{questions.length}</div>
                        <div className="text-lg text-purple-100">Respuestas Correctas</div>
                        <div className="mt-3">
                            <div className="text-2xl font-semibold text-white">
                                {Math.round((score / questions.length) * 100)}%
                            </div>
                            <div className="text-sm text-purple-200">Puntuación Final</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={resetQuiz}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reiniciar Quiz
                        </button>
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Main quiz interface
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver
                        </button>
                        <div className="flex-1"></div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{quizTitle || 'EduGame Quiz'}</h1>
                    <p className="text-purple-100">Responde correctamente para continuar</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-purple-100">
                            Pregunta {currentQuestion + 1} de {questions.length}
                        </span>
                        <span className="text-sm font-medium text-purple-100">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                        {questions[currentQuestion].question}
                    </h2>

                    <div className="space-y-4">
                        {questions[currentQuestion].options.map((option: string, index: number) => {
                            let buttonClass = "w-full p-4 rounded-xl text-left font-semibold transition-all duration-300 transform border-2 ";
                            
                            if (selectedAnswer === null) {
                                buttonClass += "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105";
                            } else if (index === correctAnswerIndex) {
                                buttonClass += "bg-green-500/20 border-green-400 text-green-100";
                            } else if (index === selectedAnswer) {
                                buttonClass += "bg-red-500/20 border-red-400 text-red-100";
                            } else {
                                buttonClass += "bg-white/5 border-white/10 text-purple-200 opacity-50";
                            }
                            
                            const showBotForThisOption = showBotMessage && 
                                (index === selectedAnswer || index === correctAnswerIndex);

                            return (
                                <div key={index} className="relative">
                                    <button
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={selectedAnswer !== null}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {selectedAnswer !== null && index === correctAnswerIndex && (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            )}
                                            {selectedAnswer === index && index !== correctAnswerIndex && (
                                                <X className="w-6 h-6 text-red-400" />
                                            )}
                                        </div>
                                    </button>
                                    {showBotForThisOption && (
                                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 z-30 hidden lg:flex items-center">
                                            {/* Speech Bubble */}
                                            <div className="bg-white rounded-2xl p-4 shadow-xl max-w-sm relative mr-4">
                                                <div className="text-gray-800 text-sm font-medium">
                                                    {botMessage}
                                                </div>
                                                {/* Arrow pointing to answer */}
                                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                                                    <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Bot Face */}
                                            <div className={`w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-500 ${showBotMessage ? 'animate-bounce' : ''}`}>
                                                {getBotFace()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Result and Next Button */}
                {showResult && (
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold mb-6 ${
                            isCorrect 
                                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                                : 'bg-red-500/20 text-red-100 border border-red-400/30'
                        }`}>
                            {isCorrect ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    ¡Correcto!
                                </>
                            ) : (
                                <>
                                    <X className="w-5 h-5" />
                                    Incorrecto
                                </>
                            )}
                        </div>

                        {isCorrect && (
                            <button
                                onClick={handleNextQuestion}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}

                        {!isCorrect && (
                            <div className="text-purple-100">
                                <p className="mb-4">La respuesta correcta era: <strong>{questions[currentQuestion].correct_answer}</strong></p>
                                <button
                                    onClick={handleNextQuestion}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                                >
                                    {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Score Display */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                        <div className="text-white">
                            <span className="font-semibold">Puntuación: </span>
                            <span className="text-pink-200 font-bold">{score}/{questions.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayQuizz;