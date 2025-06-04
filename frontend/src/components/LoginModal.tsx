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

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t('auth.login.error.generic'));
      }

      // Store token in localStorage
      localStorage.setItem('token', data.user.token);
      console.log('Login successful:', data.user);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('auth.login.title')}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
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
          placeholder={t('auth.login.passwordPlaceholder')}
        />
        <div className="mb-4">
          <label className="block text-white/80 text-sm font-medium mb-1">
            {t('auth.login.userTypeLabel')}
          </label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="estudiante">{t('auth.login.userType.student')}</option>
            <option value="profesor">{t('auth.login.userType.teacher')}</option>
          </select>
        </div>
        
        <div className="mt-6 space-y-4">
          <Button
            className=" text-blue-600 hover:bg-blue-530 w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
          </Button>
          
          <div className="flex items-center justify-center">
            <div className="flex-grow h-px bg-white/20"></div>
            <div className="px-4 text-sm text-white/60">{t('auth.login.or')}</div>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>
          
          <Button
            className="bg-white/10 text-white border border-white/30 hover:bg-white/20 flex items-center justify-center w-full"
            disabled={isLoading}
          >
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