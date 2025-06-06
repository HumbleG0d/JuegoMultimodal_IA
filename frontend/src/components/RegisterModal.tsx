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
    confirm_password: '',
    user_type: 'estudiante',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError(t('auth.register.error.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirm_password: formData.confirm_password,
          user_type: formData.user_type,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('auth.register.error.generic'));
      }

      console.log('Registration successful:', data);
      onSwitchToLogin(); // Switch to login modal after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.register.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auth.register.title')}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
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
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
          placeholder={t('auth.register.passwordPlaceholder')}
        />
        <div className="mb-4">
          <label className="block text-white/80 text-sm font-medium mb-1">
            {t('auth.register.userTypeLabel')}
          </label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black bg-white  border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="estudiante">{t('auth.register.userType.student')}</option>
            <option value="profesor">{t('auth.register.userType.teacher')}</option>
          </select>
        </div>
        
        <div className="mt-6 space-y-4">
          <Button
            className=" text-blue-600 hover:bg-blue-530 w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t('auth.register.loading') : t('auth.register.submit')}
          </Button>
          
          <div className="flex items-center justify-center">
            <div className="flex-grow h-px bg-white/20"></div>
            <div className="px-4 text-sm text-white/60">{t('auth.register.or')}</div>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>
          
          <Button
            className="bg-white/10 text-white border border-white/30 hover:bg-white/20 flex items-center justify-center w-full"
            disabled={isLoading}
          >
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
