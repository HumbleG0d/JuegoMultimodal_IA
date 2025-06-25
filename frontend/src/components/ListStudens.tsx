import { Users, Trophy, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { StudensResponse, StudensQuiz } from '../types';

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

const ListStudents: React.FC = () => {
  const [students, setStudents] = useState<StudensQuiz[]>([]);
  const [statistics, setStatistics] = useState<StudentStats[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getStudents = async () => {
    try {
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
        const errorText = await response.text();
        throw new Error(`Error al obtener estudiantes: ${response.status} - ${errorText}`);
      }

      let data: StudensResponse;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid JSON response');
      }

      setStudents(data.students.map(st => ({
        id: st.id,
        name: st.nombre,
        avatar: 'https://emtstatic.com/2021/09/jordinp.png', // Placeholder avatar
        score: 0, // Se actualizará con estadísticas
        progress: 0, // Se actualizará con estadísticas
        lastActive: 'Desconocido' // Valor por defecto
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar estudiantes');
    }
  };

  const getStatistics = async () => {
    try {
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
        const errorText = await response.text();
        throw new Error(`Error al obtener estadísticas: ${response.status} - ${errorText}`);
      }

      const data: StatisticsResponse = await response.json();
      console.log('✅ Estadísticas recibidas:', data);
      setStatistics(data.estadisticas);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar estadísticas');
    }
  };

  // Función para calcular el puntaje total de un estudiante
  const calculateStudentTotalScore = (studentId: number): number => {
    const studentStats = statistics.find(stat => stat.estudiante_id === studentId);
    if (!studentStats || !studentStats.quizzes) return 0;
    
    return studentStats.quizzes.reduce((total, quiz) => total + quiz.puntaje, 0);
  };

  // Función para actualizar los estudiantes con sus puntajes calculados
  const getStudentsWithScores = (): StudensQuiz[] => {
    return students.map(student => ({
      ...student,
      score: calculateStudentTotalScore(student.id)
    })).sort((a, b) => b.score - a.score); // Ordenar por puntaje descendente
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    getStatistics();
  }, []);

  // Obtener estudiantes con puntajes actualizados
  const studentsWithScores = getStudentsWithScores();

  // Calcular estadísticas generales para las tarjetas superiores
  const totalStudents = students.length;
  const averageGeneralScore = studentsWithScores.length > 0
    ? Math.round(studentsWithScores.reduce((sum, student) => sum + student.score, 0) / studentsWithScores.length)
    : 0;
  const completionRate = students.length > 0
    ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length)
    : 0;

  return (
    <section className="space-y-6">
      {error && (
        <div className="bg-red-500/20 text-red-100 p-4 rounded-xl">
          {error}
        </div>
      )}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Total Estudiantes</p>
            <p className="text-2xl font-bold text-white">{totalStudents}</p>
          </div>
          <Users className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Promedio General</p>
            <p className="text-2xl font-bold text-white">{averageGeneralScore}</p>
          </div>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Completados</p>
            <p className="text-2xl font-bold text-white">{completionRate}%</p>
          </div>
          <Calendar className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      {/* Top Students */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h3 className="text-white font-semibold text-lg mb-6">Mejores Estudiantes</h3>
        <div className="space-y-4">
          {studentsWithScores.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-white/60 text-sm">
                      {statistics.find(stat => stat.estudiante_id === student.id)?.quizzes?.length || 0} quizzes completados
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-white text-sm">Puntuación Total</p>
                  <p className="text-white font-bold text-lg">{Math.floor(student.score*20/3)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListStudents;