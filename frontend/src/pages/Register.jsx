import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/Navigation';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Валидация паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    // Валидация пароля (мин. 8 символов, заглавная, цифра)
    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 uppercase tracking-wider">Регистрация</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Создайте аккаунт для начала игры</p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Имя пользователя</label>
              <input 
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={3}
                maxLength={20}
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                placeholder="username"
              />
              <p className="text-xs text-gray-600 mt-1">3-20 символов, только буквы, цифры и _</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Пароль</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={8}
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-600 mt-1">Мин. 8 символов, заглавная буква и цифра</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Подтвердите пароль</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] py-3 uppercase tracking-wider transition mt-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
                    
          <p className="text-center text-gray-500 text-sm mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;