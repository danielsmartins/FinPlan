/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import clsx from 'clsx';


const ValidationRequirement = ({ isValid, text }) => (
  <li className={clsx("flex items-center text-sm", {
    "text-green-600": isValid,
    "text-gray-500": !isValid,
  })}>
    {isValid ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
    {text}
  </li>
);

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [passwordValidation, setPasswordValidation] = useState({
    hasSixChars: false,
    hasUpper: false,
    hasNumber: false,
  });

  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    isValid: null, 
    message: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordValidation({
      hasSixChars: password.length >= 6,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);


  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!email) {
        setEmailValidation({ isValid: null, message: '' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailValidation({ isValid: false, message: 'Formato de email inválido.' });
        return;
      }

      setIsEmailChecking(true);
      try {
        const response = await api.post('/auth/check-email', { email });
        if (response.data.isAvailable) {
          setEmailValidation({ isValid: true, message: 'Email disponível!' });
        } else {
          setEmailValidation({ isValid: false, message: 'Este email já está em uso.' });
        }
      } catch (err) {
        console.warn("Endpoint /auth/check-email não encontrado. Validação de disponibilidade pulada.");
        setEmailValidation({ isValid: true, message: 'Formato de email válido.' });
      } finally {
        setIsEmailChecking(false);
      }
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError('Por favor, crie uma senha que atenda a todos os critérios.');
      return;
    }
    if (emailValidation.isValid !== true) {
      setError('Por favor, utilize um email válido e disponível.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess('Cadastro realizado! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao realizar o cadastro.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthScore = Object.values(passwordValidation).filter(Boolean).length;
  const isFormValid = passwordStrengthScore === 3 && emailValidation.isValid === true;

  const strengthBarColor = clsx({
    'bg-red-500': passwordStrengthScore < 2,
    'bg-yellow-500': passwordStrengthScore === 2,
    'bg-green-500': passwordStrengthScore === 3,
  });
  const strengthBarWidth = `${(passwordStrengthScore / 3) * 100}%`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 -mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Crie sua conta</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</label>
            <input id="name" type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="email-register" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email-register" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            

            <div className="mt-1"> 
              {isEmailChecking && <p className="text-xs text-gray-50a0 flex items-center"><Loader2 size={14} className="animate-spin mr-1" /> Verificando...</p>}
              {emailValidation.message && !isEmailChecking && (
                <p className={clsx("text-xs", {
                  "text-green-600": emailValidation.isValid,
                  "text-red-600": !emailValidation.isValid,
                })}>
                  {emailValidation.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password-register" className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <input id="password-register" type={showPassword ? 'text' : 'password'} placeholder="Crie uma senha forte" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {password.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2"><div className={clsx("h-2 rounded-full transition-all duration-300", strengthBarColor)} style={{ width: strengthBarWidth }}></div></div>
              <ul className="space-y-1">
                <ValidationRequirement isValid={passwordValidation.hasSixChars} text="Pelo menos 6 caracteres" />
                <ValidationRequirement isValid={passwordValidation.hasUpper} text="Uma letra maiúscula" />
                <ValidationRequirement isValid={passwordValidation.hasNumber} text="Pelo menos um número" />
              </ul>
            </div>
          )}
          
          <button type="submit" disabled={loading || !isFormValid}
            className={clsx("w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
              { "opacity-50 cursor-not-allowed": loading || !isFormValid }
            )}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        
        {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-center text-green-600">{success}</p>}
        
        <p className="text-sm text-center text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
