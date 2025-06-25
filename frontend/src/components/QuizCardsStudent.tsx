import { 
  BookOpen, 
  Play,
  Clock,
  Trophy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import type { StaticsQuiz , StaticResponse} from "../types";
import type { DashQuiz, QuizzesResponse,} from '../types';
import Button from './ui/Button';

const QuizzCardsStudent: React.FC = () => {
  const [dashQuiz, setDashQuiz] = useState<DashQuiz[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0); // Track total students
  const [puntaje , SetPuntaje] = useState(0)
  const navigate = useNavigate();
  
  const getQuizzes = async () => { 
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/estudiante/dashboard/quizzes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      let data: QuizzesResponse;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid JSON response');
      }

      console.log("Respuesta de la api:", data);

      if (!response.ok) { 
        throw new Error('Failed to fetch quizzes');
      }

      const cards: DashQuiz[] = data.quizzes.map((quiz) => ({
        id: quiz.quiz_id,
        title: quiz.quiz_data.title,
        questions: quiz.quiz_data.questions.length,
        timeAgo: new Date(quiz.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        thumbnail: 'https://naturcanin.com/wp-content/uploads/2024/07/gatos-pueden-comer-zanahoria.jpg',
        students: 0, // Por implementar
        accuracy: Math.floor(Math.random() * 100), // Por implementar
      }));
      setTotalStudents(cards.length); // Set total students
      setDashQuiz(cards);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

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
        let pt = 0
        statics.map((s) => {
          console.log(s.puntaje)
          pt += s.puntaje
        })
        SetPuntaje(pt)
         
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
  
    getStatistics();
   
  }, []);

 
  useEffect(() => {
    getQuizzes();
  }, []);

  const handleViewQuiz = (quizId: string) => {
    navigate(`/student/quiz/${quizId}`);
  };

  return ( 
    <div className='space-y-6'>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-white">{totalStudents}</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Precisión Promedio</p>
              <p className="text-2xl font-bold text-white">{Math.floor((puntaje/3)*20)}%</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quizz List */}
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashQuiz.map((quiz) => (
          <div key={quiz.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-200 group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={quiz.thumbnail} 
                alt={quiz.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className='p-6'>
              <h3 className="text-white font-semibold text-lg mb-2">{quiz.title}</h3>
              <div className="flex items-center text-white/70 text-sm mb-4 space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.timeAgo}</span>
                </span>
                <span>{quiz.questions} preguntas</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-white/70">
                  {quiz.accuracy}% precisión
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex  items-center justify-center space-x-1"
                  onClick={() => handleViewQuiz(quiz.id)}
                >
                  <Play className="w-4 h-4" />
                  <span>Jugar</span>
                </Button>
                </div>
            </div>
          </div>
        ))}
      </article>
    </div>
  );
};

export default QuizzCardsStudent;