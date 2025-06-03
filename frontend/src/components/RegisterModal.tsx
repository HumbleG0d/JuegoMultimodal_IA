import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";
import Button from "./ui/Button";
import { Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

const RegisterModal: React.FC<{ isOpen: boolean; onClose: () => void; onSwitchToLogin: () => void }> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt:', formData);
    // For demo purposes, we'll just close the modal
    // onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auth.register.title')}>
      <form onSubmit={handleSubmit}>
        <Input
          label={t('auth.register.emailLabel')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={t('auth.register.emailPlaceholder')}
        />
        <Input
          label={t('auth.register.usernameLabel')}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder={t('auth.register.usernamePlaceholder')}
        />
        <Input
          label={t('auth.register.passwordLabel')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder={t('auth.register.passwordPlaceholder')}
        />
        <Input
          label={t('auth.register.confirmPasswordLabel')}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder={t('auth.register.passwordPlaceholder')}
        />
        
        <div className="flex flex-col mt-6 space-y-4">
          <Button className=" text-blue-600 hover:bg-blue-540">
            {t('auth.register.submit')}
          </Button>
          
          <div className="flex items-center justify-center">
            <div className="flex-grow h-px bg-white/20"></div>
            <div className="px-4 text-sm text-white/60">{t('auth.register.or')}</div>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>
          
          <Button className="bg-white/10 text-white border border-white/30 hover:bg-white/20 flex items-center justify-center">
            <Mail className="mr-2 h-5 w-5" />
            {t('auth.register.continueWithGmail')}
          </Button>
        </div>
        
        <div className="mt-6 text-center text-white/80">
          <p>
            {t('auth.register.haveAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-white underline hover:text-gray-200 font-medium"
            >
              {t('auth.register.loginLink')}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;