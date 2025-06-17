import React, { useEffect, useState } from 'react';
import { Search, X, User, Plus } from 'lucide-react';
import type { StudensResponse, Students } from '../types'; 

interface SearchStudentProps {  
  isOpen: boolean;
  onClose: () => void;
  onStudentAdd?: (student: Students) => void;
}

const SearchStudent = ({ isOpen, onClose, onStudentAdd }: SearchStudentProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<Students[]>([]);
    const listStudents = async() => {
        try {
            const tonken = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/teacher/listare', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tonken}`,
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

            const students: Students[] = data.students.map(st => ({
                id: st.id,
                nombre: st.nombre,
                email: st.email,
            }));
            setStudents(students);
        }catch(error) {
            console.error('Error fetching students:', error);
        }
        
    }

  useEffect(() => {
        listStudents();
    }, []);

  // Filtrar alumnos por búsqueda
    const filteredStudents = students.filter((student: Students) =>
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Agregar alumno
  const addStudent = (student: Students) => {
    if (onStudentAdd) {
      onStudentAdd(student);
    }
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Buscar Alumno</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredStudents.length > 0 ? (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => addStudent(student)}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Plus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{student.nombre}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'No se encontraron alumnos' : 'Escribe para buscar alumnos'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchStudent;