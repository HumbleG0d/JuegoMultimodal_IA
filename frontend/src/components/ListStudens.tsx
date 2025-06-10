import { 
  Users, 
  Trophy,
  TrendingUp,
  Calendar
} from 'lucide-react';

import type { StudensQuiz } from '../types';

const topStudents: StudensQuiz[] = [
    {
      id: '1',
      name: 'Ana García',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      score: 95,
      progress: 88,
      lastActive: '2 min'
    },
    {
      id: '2',
      name: 'Carlos López',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      score: 89,
      progress: 75,
      lastActive: '5 min'
    },
    {
      id: '3',
      name: 'María Torres',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      score: 92,
      progress: 82,
      lastActive: '10 min'
    }
  ];

const ListStudents = () => {
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
                    {topStudents.map((student, index) => (
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