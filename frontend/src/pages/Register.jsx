import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    console.log('Регистрация:', formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 uppercase tracking-wider">Регистрация</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Присоединяйся к сообществу</p>
          
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
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="username"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="email@example.com"
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
                minLength={6}
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Подтвердите пароль</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" id="terms" required className="accent-blue-500" />
              <label htmlFor="terms" className="text-gray-400">
                Я принимаю <span className="text-blue-500 hover:text-blue-400 cursor-pointer">условия использования</span>
              </label>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] py-3 uppercase tracking-wider transition mt-4 font-semibold"
            >
              Зарегистрироваться
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