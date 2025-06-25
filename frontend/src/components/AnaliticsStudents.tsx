import { useState, useEffect } from 'react';
import { Trophy, BookOpen, Calendar, Star } from 'lucide-react';

interface QuizResult {
  quiz_id: string;
  puntaje: number;
}

interface StudentStats {
  estudiante_id: number;
  quizzes: QuizResult[];
}

interface StatisticsResponse {
  estadisticas: StudentStats[];
}

interface Student {
  id: number;
  nombre: string;
}

interface StudentsResponse {
  students: Student[];
}

interface QuizData {
  id: string;
  nombre: string;
  created_at: string;
  quiz_data: {
    title: string;
    topic: string;
    age_group: string;
    questions: any[];
  };
}

interface QuizResponse {
  quiz: QuizData[];
}

interface StudentQuizDetail {
  quiz_id: string;
  quiz_name: string;
  quiz_topic: string;
  puntaje: number;
  created_at: string;
}

interface StudentCardData {
  id: number;
  name: string;
  totalScore: number;
  quizzes: StudentQuizDetail[];
}

const AnaliticsStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<StudentStats[]>([]);
  const [studentCards, setStudentCards] = useState<StudentCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStudents = async (): Promise<Student[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/teacher/listare', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener estudiantes: ${response.status}`);
    }

    const data: StudentsResponse = await response.json();
    return data.students;
  };

  const getStatistics = async (): Promise<StudentStats[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/teacher/estadisticas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas: ${response.status}`);
    }

    const data: StatisticsResponse = await response.json();
    return data.estadisticas;
  };

  const getQuizDetails = async (quizId: string): Promise<QuizData | null> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teacher/dashboard/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.warn(`No se pudo obtener detalles del quiz ${quizId}: ${response.status}`);
        return null;
      }

      const data: QuizResponse = await response.json();
      const quiz = data.quiz[0];
      
      if (!quiz) {
        console.warn(`Quiz ${quizId} no encontrado en la respuesta`);
        return null;
      }
      
      return quiz;
    } catch (error) {
      console.error(`Error al obtener detalles del quiz ${quizId}:`, error);
      return null;
    }
  };

  const loadStudentCards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar estudiantes y estadísticas
      const [studentsData, statisticsData] = await Promise.all([
        getStudents(),
        getStatistics()
      ]);

      setStudents(studentsData);
      setStatistics(statisticsData);

      // Crear tarjetas de estudiantes con detalles de quizzes
      const cards: StudentCardData[] = [];

      for (const student of studentsData) {
        const studentStats = statisticsData.find(stat => stat.estudiante_id === student.id);
        
        if (studentStats && studentStats.quizzes) {
          const quizDetails: StudentQuizDetail[] = [];
          
          // Obtener detalles de cada quiz
          for (const quizResult of studentStats.quizzes) {
            const quizData = await getQuizDetails(quizResult.quiz_id);
            
            // Debug: mostrar qué datos se recibieron
            console.log(`Quiz ${quizResult.quiz_id}:`, {
              quizData,
              nombre: quizData?.nombre,
              title: quizData?.quiz_data?.title,
              topic: quizData?.quiz_data?.topic
            });
            
            quizDetails.push({
              quiz_id: quizResult.quiz_id,
              quiz_name: quizData?.nombre || quizData?.quiz_data?.title || 'Quiz sin título',
              quiz_topic: quizData?.quiz_data?.topic || 'Tema no disponible',
              puntaje: quizResult.puntaje,
              created_at: quizData?.created_at || new Date().toISOString()
            });
          }

          const totalScore = studentStats.quizzes.reduce((sum, quiz) => sum + quiz.puntaje, 0);

          cards.push({
            id: student.id,
            name: student.nombre,
            totalScore,
            quizzes: quizDetails.sort((a, b) => b.puntaje - a.puntaje) // Ordenar por puntaje descendente
          });
        } else {
          // Estudiante sin quizzes
          cards.push({
            id: student.id,
            name: student.nombre,
            totalScore: 0,
            quizzes: []
          });
        }
      }

      // Ordenar estudiantes por puntaje total descendente
      cards.sort((a, b) => b.totalScore - a.totalScore);
      setStudentCards(cards);

    } catch (error) {
      console.error('Error loading student cards:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentCards();
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha desconocida';
    }
  };

  const getScoreColor = (score: number, maxScore: number = 100): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGradeEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🎓';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="text-white ml-4">Cargando datos de estudiantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-100 p-4 rounded-xl">
        <p>Error: {error}</p>
        <button 
          onClick={loadStudentCards}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Rendimiento Detallado por Estudiante</h2>
        <div className="text-white/70">
          <span className="text-sm">{studentCards.length} estudiantes</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {studentCards.map((student, index) => (
          <div
            key={student.id}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
          >
            {/* Header del estudiante */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg flex items-center">
                    {student.name}
                    <span className="ml-2 text-2xl">{getGradeEmoji(index + 1)}</span>
                  </h3>
                  <p className="text-white/60 text-sm">Puesto #{index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className={`text-2xl font-bold ${getScoreColor(student.totalScore)}`}>
                    {student.totalScore}
                  </span>
                </div>
                <p className="text-white/60 text-sm">Puntaje Total</p>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-white font-semibold">{student.quizzes.length}</p>
                <p className="text-white/60 text-xs">Quizzes</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-white font-semibold">
                  {student.quizzes.length > 0 
                    ? Math.round(student.totalScore / student.quizzes.length) 
                    : 0}
                </p>
                <p className="text-white/60 text-xs">Promedio</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Trophy className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-white font-semibold">
                  {student.quizzes.length > 0 
                    ? Math.max(...student.quizzes.map(q => q.puntaje))
                    : 0}
                </p>
                <p className="text-white/60 text-xs">Mejor</p>
              </div>
            </div>

            {/* Lista de quizzes */}
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Quizzes Realizados
              </h4>
              
              {student.quizzes.length === 0 ? (
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-white/60 text-sm">Sin quizzes completados aún</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {student.quizzes.map((quiz, quizIndex) => (
                    <div
                      key={quiz.quiz_id}
                      className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">
                            {quiz.quiz_name}
                          </p>
                          <p className="text-white/60 text-xs">
                            {quiz.quiz_topic} • {formatDate(quiz.created_at)}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <span className={`font-bold ${getScoreColor(quiz.puntaje)}`}>
                            {quiz.puntaje}
                          </span>
                          {quizIndex === 0 && quiz.puntaje === Math.max(...student.quizzes.map(q => q.puntaje)) && (
                            <Star className="w-4 h-4 text-yellow-400 inline ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {studentCards.length === 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
          <BookOpen className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <p className="text-white/80 font-medium">No hay estudiantes registrados</p>
          <p className="text-white/60 text-sm">Los estudiantes aparecerán aquí una vez que se registren</p>
        </div>
      )}
    </div>
  );
};
export default AnaliticsStudents;