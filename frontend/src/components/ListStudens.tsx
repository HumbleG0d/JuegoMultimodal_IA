import { 
  Users, 
  Trophy,
  TrendingUp,
  Calendar
} from 'lucide-react';

import { useState, useEffect} from 'react';
import type { StudensResponse , StudensQuiz } from '../types'; 



const ListStudents = () => {

  const [students, setStudents] = useState<StudensQuiz[]>([]);
  const getStudents = async () => { 

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/teacher/listare', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      let data: StudensResponse
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid JSON response');
      }

      const students: StudensQuiz[] = data.students.map(st => ({
        id: st.id,
        name: st.nombre,
        avatar: 'https://emtstatic.com/2021/09/jordinp.png', // Placeholder avatar
        score: Math.floor(Math.random() * 100), // Random score for demo
        progress: Math.floor(Math.random() * 100), // Random progress for demo
        lastActive: `${Math.floor(Math.random() * 60)} min` // Random last active time for demo
      }))

      setStudents(students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }

  }

  useEffect(() => {
    getStudents();
  }, []);


    return (
        <section className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Estudiantes</p>
                        <p className="text-2xl font-bold text-white">142</p>
                      </div>
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Activos Hoy</p>
                        <p className="text-2xl font-bold text-white">89</p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Promedio General</p>
                        <p className="text-2xl font-bold text-white">8.4</p>
                      </div>
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Completados</p>
                        <p className="text-2xl font-bold text-white">76%</p>
                      </div>
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
            </div>
            {/* Top Students */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                  <h3 className="text-white font-semibold text-lg mb-6">Mejores Estudiantes</h3>
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
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
                              <p className="text-white/70 text-sm">Activo hace {student.lastActive}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-white text-sm">Puntuación</p>
                            <p className="text-white font-bold">{student.score}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">Progreso</p>
                            <div className="w-20 bg-white/20 rounded-full h-2 mt-1">
                              <div 
                                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${student.progress}%` }}
                              />
                              </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ListStudents