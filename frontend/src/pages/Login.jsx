import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

    if (!formData.username || !formData.password) {
      setError('Заполните все поля');
      return;
    }

    // TODO: подключить бэкенд
    console.log('Вход:', formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 uppercase tracking-wider">Вход</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Добро пожаловать обратно!</p>
          
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
              <label className="block text-sm text-gray-500 mb-1 uppercase tracking-wider">Пароль</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                <span className="text-gray-400">Запомнить меня</span>
              </label>
              <span className="text-blue-500 hover:text-blue-400 cursor-pointer text-sm">
                Забыли пароль?
              </span>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] py-3 uppercase tracking-wider transition mt-4 font-semibold"
            >
              Войти
            </button>
          </form>
                    
          <p className="text-center text-gray-500 text-sm mt-4">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;