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

export interface Question {
  id: string; // Generaremos un ID único en el frontend
  question: string;
  options: string[];
  correct_answer: string; // Convertimos el índice a la opción correcta
  explanation: string;
  type: 'multiple_choice';
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


export interface IconProps extends LucideProps {
  name: string;
}

export interface DashQuiz {
  id: string,
  title: string,
  subject: string,
  questions: number,
  timeAgo: string,
  thumbnail: string,
  plays: number,
  accuracy: number,
}

export interface StudensQuiz{
  id: string,
  name: string,
  avatar: string,
  score: number,
  progress: number,
  lastActive: string,
}

export interface ChatBootMessage{
  id: number,
  type: 'bot' | 'user',
  text: string,
  time: string,
}