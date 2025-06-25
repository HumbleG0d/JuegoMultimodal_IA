// import type { LucideProps } from 'lucide-react'; // Uncomment if LucideProps type exists
type LucideProps = React.SVGProps<SVGSVGElement>; // Use this if LucideProps type does not exist in lucide-react

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean,
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export interface InputProps{
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
};

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}
 

export interface Questionprompt {
  id: string; // Generaremos un ID único en el frontend
  correct_answer: string;
  explanation: string;
  options: string[];
  question: string;
}

export interface QuizData {
  age_group: string;
  created_at: string;
  created_by: number;
  original_prompt: string;
  questions: Question[];
  title: string;
  topic: string;
}

export interface QuizResponse {
  success: boolean;
  quiz_id: string;
  filename: string;
  message: string;
  quiz_data: {
    quiz_id: string;
    created_by: number;
    created_at: string;
    original_prompt: string;
    title: string;
    topic: string;
    age_group: string;
    questions: {
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
    }[];
  };
}

export interface Quiz {
  id: string;
  nombre: string;
  created_at: string;
  user_id: number;
  quiz_data: {
    age_group: string;
    created_at: string;
    created_by: number;
    original_prompt: string;
    title: string;
    topic: string;
    questions: {
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
    }[];
  };
  quiz_id: string;
}


export interface QuizzesResponse {
  quizzes: Quiz[];
}

export interface IconProps extends LucideProps {
  name: string;
}

export interface DashQuiz {
  id: string,
  title: string,
  questions: number,
  timeAgo: string,
  thumbnail: string,
  students: number,
  accuracy: number,
}

export interface StudensQuiz{
  id: number,
  name: string,
  avatar: string,
  score: number,
  progress: number,
  lastActive: string,
}

export interface Students {
  email: string;
  id: number;
  nombre: string;
}

export interface AsignedStudentQuiz{
  id_quiz: string,
  id_student: number,
}


export interface StudensResponse { 
  students: Students[];
}

export interface ChatBootMessage{
  id: number,
  type: 'bot' | 'user',
  text: string,
  time: string,
}

export interface Profile{
  user_name: string,
  user_type: string,
  exp: number,
}


export interface StaticsQuiz{
  id: number,
  puntaje: number,
  quiz_id: string
}

export interface StaticResponse{
  estudiante_id: number,
  id: number,
  puntaje: number,
  quiz_id: string
}

export interface ReportStaticStudents{
  estudiante_id: number,
  quizzes: ResultQuiz[]
}

export interface ResultQuiz{
  puntaje: number,
  quiz_id: string
}