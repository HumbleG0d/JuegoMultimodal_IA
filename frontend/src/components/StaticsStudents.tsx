import { useState, useEffect } from "react";
import { Trophy, BookOpen, Star, Award } from "lucide-react";

interface StaticsQuiz {
  id: number;
  puntaje: number;
  quiz_id: string;
}

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

interface StaticResponse {
  id: number;
  puntaje: number;
  quiz_id: string;
}

const StaticsStudents = () => {
    const [isStatics, setIsStatics] = useState<StaticsQuiz[]>([]);
    const [quizTitles, setQuizTitles] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStatistics = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/estudiante/estadisticas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error al obtener estadísticas: ${response.status} - ${errorText}`);
                }

                const data: { "Estadisticas del alumno": StaticResponse[] } = await response.json();
                console.log("DATA -->", data);

                const statics: StaticsQuiz[] = data["Estadisticas del alumno"].map((d) => ({
                    id: d.id,
                    puntaje: d.puntaje,
                    quiz_id: d.quiz_id,
                }));
                setIsStatics(statics);

                // Obtener los títulos de los quizzes
                const titlePromises = statics.map(async (stat) => {
                    const title = await getTitle(stat.quiz_id);
                    return { quiz_id: stat.quiz_id, title };
                });

                const titles = await Promise.all(titlePromises);
                const titleMap = titles.reduce((acc, { quiz_id, title }) => {
                    acc[quiz_id] = title;
                    return acc;
                }, {} as { [key: string]: string });

                setQuizTitles(titleMap);

            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
                setError(error instanceof Error ? error.message : 'Error desconocido al cargar estadísticas');
            }
        };

        getStatistics();
    }, []);

    const getTitle = async (quizId: string): Promise<string> => {
        try {
            const response = await fetch(`http://localhost:5000/api/student/dashboard/quiz/${quizId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const data: QuizResponse = await response.json();
            console.log('✅ Quiz data received:', data);

            if (!data.quiz || data.quiz.length === 0) {
                throw new Error('No se encontró el quiz');
            }

            return data.quiz[0].nombre;
        } catch (error) {
            console.error('Error al obtener el título del quiz:', error);
            return 'Título no disponible';
        }
    };

    const getScoreIcon = (score: number) => {
        if (score >= 90) return <Trophy className="w-8 h-8 text-yellow-400" />;
        if (score >= 80) return <Award className="w-8 h-8 text-blue-400" />;
        if (score >= 70) return <Star className="w-8 h-8 text-purple-400" />;
        return <BookOpen className="w-8 h-8 text-gray-400" />;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-yellow-400";
        if (score >= 80) return "text-blue-400";
        if (score >= 70) return "text-purple-400";
        return "text-gray-400";
    };

    const getCardBorder = (score: number) => {
        if (score >= 90) return "border-yellow-400/40";
        if (score >= 80) return "border-blue-400/40";
        if (score >= 70) return "border-purple-400/40";
        return "border-gray-400/40";
    };

    return (
        <div className="min-h-screen  flex flex-col items-center p-4">
            {error && (
                <div className="bg-red-500/20 text-red-100 p-4 rounded-xl mb-6 max-w-2xl w-full">
                    {error}
                </div>
            )}
            
            {!isStatics || isStatics.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
                    <BookOpen className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                    <p className="text-purple-100 text-lg">No hay estadísticas disponibles.</p>
                </div>
            ) : (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isStatics.map((stat) => (
                        <div
                            key={stat.id}
                            className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border ${getCardBorder(stat.puntaje)} hover:scale-105 transition-transform duration-300`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                                        {quizTitles[stat.quiz_id] || 'Cargando título...'}
                                    </h2>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    {getScoreIcon(stat.puntaje)}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-purple-100 text-sm">Puntuación:</span>
                                <span className={`text-3xl font-bold ${getScoreColor(stat.puntaje)}`}>
                                    {stat.puntaje*20}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaticsStudents;