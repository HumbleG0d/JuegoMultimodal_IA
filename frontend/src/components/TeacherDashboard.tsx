import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router";
import Icon from "./ui/Icon";
import { Link } from 'react-router';
import { SIDEBAR_ITEMS_TEACHER } from "../constants";
import Button from "./ui/Button";
import { 
  Plus, 
  Search, 
  Bell, 
  ChevronRight,
} from 'lucide-react';
import { TowerControl as GameController } from 'lucide-react';
import GenerateQuiz from "./GenerateQuiz";
import QuizzCards from "./QuizzCards";
import ListStudents from "./ListStudens";
import type {Profile} from "../types";
import AnaliticsStudents from "./AnaliticsStudents";
const TeacherDashBoard: React.FC = () => {


    const [activeSection, setActiveSection] = useState('quizzes');
    
    const [isScrolled, setIsScrolled] = useState(false);

    const [isExiting, setIsExiting] = useState(false);


    const [isProfile , setIsProfiele] = useState<Profile>();

    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 10);
        };
        const token = localStorage.getItem('token');
        const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

        const dataProfile: Profile = {
            user_name: decodedToken.user_name,
            user_type: decodedToken.user_type,
            exp: decodedToken.exp,
        }

        setIsProfiele(dataProfile);
        console.log('Decoded Token:', decodedToken);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    

    if( isExiting ) navigate('/')

    return (
        <section className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="flex">
                <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 min-h-screen top-">
                    

                    <div className="p-3.5">
                        {/* Logo */}
                        <div className={`flex  items-center justify-start h-16 ${isScrolled ? 'bg-white/20' : 'bg-transparent'}`}>
                       <Link to="/#home" className="flex items-center gap-2">
                        <GameController
                        className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`}
                        aria-hidden="true"
                        />
                        <span
                        className={`text-xl font-bold ${
                            isScrolled ? 'text-gray-800' : 'text-white'
                        }`}
                        >
                            Edugame AI
                        </span>
                     </Link>    
                    </div>

                        {/* Teacher Profile */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                            <div className="flex items-center space-x-3">
                                {/*Img profile*/}
                                <img 
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEIJr8_FgBJYrdc_5C9oHRKOFcuJyAg4-j5XfI7IlB6YMGy4iafScYo2-aT7qhgjX9xWk&usqp=CAU"
                                    alt="Lujan Carrion Sideral"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-white font-medium text-sm">{isProfile?.user_name}</p>
                                    <p className="text-white/70 text-xs">{isProfile?.user_type}</p>
                                </div>
                            </div>
                        </div>

                        {/*Quick Action
                            TODO: Implement the quick action functionality
                        */ }
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl py-3 px-4 font-medium mb-6 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                            variant="secondary"
                            onClick={() => setActiveSection('generateQuiz')}>
                            <Plus />
                            <span>Generar Quiz</span>
                        </Button>

                        {/* Navigation Links */}

                        <nav className="space-y-2">
                            {SIDEBAR_ITEMS_TEACHER.map((item) => (
                                <Button
                                    key={item.id}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                    activeSection === item.id
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                                    onClick={() => setActiveSection(item.id)}>
                                    <Icon name={item.icon} className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                    {activeSection === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    )}
                                    </Button>
                            ))}
                            <Button
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-white/10 hover:text-white'
                                }`}
                                    onClick={() => setIsExiting(true)}>
                                    <Icon name="LogOut" className="w-4 h-4" />
                                    <span className="font-medium">Salir</span>
                            </Button>
                        </nav>
                    </div>
                </div>
                
                {/*Main Content*/}
                <section className="flex-1">
                    <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2x1 font-bold text-white mb-1">
                                    {activeSection === 'quizzes' && 'Quizzes'}
                                    {activeSection === 'students' && 'Estudiantes'}
                                    {activeSection === 'analytics' && 'Estadisticas'}
                                    {activeSection === 'generateQuiz' && 'Generar Quiz'}
                                </h1>
                                <p className="text-white/70 text-sm">
                                    {activeSection === 'quizzes' && 'Crear quizzes para los estudiantes'}
                                    {activeSection === 'students' && 'Ver los estudiantes registrados.'}
                                    {activeSection === 'analytics' && 'Estadisticas de los alumnos en base a los quizzes'}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                            <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar..."
                                    className="bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                                />
                            </div>
                                <div className="relative flex gap-4"  ref={menuRef}>
                                    <button className="p-2 bg-white/10 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors">
                                <Bell className="w-4 h-4" />
                                </button>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="p-8">
                        {
                            activeSection === 'quizzes' && (
                                <QuizzCards/>
                            )
                        }
                        {
                            activeSection === 'students' && (
                                <ListStudents />
                            )
                        }{
                            activeSection === 'generateQuiz' && (
                                <GenerateQuiz/>
                            )
                        }
                        {
                            activeSection == 'analytics' && (
                                <AnaliticsStudents/>
                            )
                        }

                    </section>
                </section>

            </div>
        </section>
    );
};
export default TeacherDashBoard;