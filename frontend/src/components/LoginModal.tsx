import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";
import Button from "./ui/Button";
import { Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onSwitchToRegister: () => void }> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
    // For demo purposes, we'll just close the modal
    // onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auth.login.title')}>
      <form onSubmit={handleSubmit}>
        <Input
          label={t('auth.login.emailLabel')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={t('auth.login.emailPlaceholder')}
        />
        <Input
          label={t('auth.login.passwordLabel')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
        />
        
        <div className="flex flex-col mt-6 space-y-4">
          <Button className=" text-blue-600 hover:bg-blue-540">
            {t('auth.login.submit')}
          </Button>
          
          <div className="flex items-center justify-center">
            <div className="flex-grow h-px bg-white/20"></div>
            <div className="px-4 text-sm text-white/60">o</div>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>
          
          <Button className="bg-white/10 text-white border border-white/30 hover:bg-white/20 flex items-center justify-center">
            <Mail className="mr-2 h-5 w-5" />
            {t('auth.login.continueWithGmail')}
          </Button>
        </div>
        
        <div className="mt-6 text-center text-white/80">
          <p>
           {t('auth.login.noAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-white underline hover:text-gray-200 font-medium"
            >
              {t('auth.login.registerLink')}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;