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

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
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
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[];
  correctAnswer?: string;
}


export interface IconProps extends LucideProps {
  name: string;
}