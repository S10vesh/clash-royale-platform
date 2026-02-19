import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="border-b border-[#333] bg-black/40 backdrop-blur-md">
      <div className="container-cs flex items-center justify-between py-5">
        {/* Логотип и меню */}
        <div className="flex items-center gap-12">
          <h1 className="text-3xl font-bold text-white tracking-wider">CLASH ROYALE</h1>
          
          {/* Меню */}
          <div className="flex gap-10 text-lg uppercase tracking-wider">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-white' : 'text-gray-400'} hover:text-white transition font-medium`}
            >
              ГЛАВНАЯ
            </Link>
            <Link 
              to="/tournaments" 
              className={`${isActive('/tournaments') ? 'text-white' : 'text-gray-400'} hover:text-white transition font-medium`}
            >
              ТУРНИРЫ
            </Link>
            <Link 
              to="/leaderboard" 
              className={`${isActive('/leaderboard') ? 'text-white' : 'text-gray-400'} hover:text-white transition font-medium`}
            >
              ТОПЫ
            </Link>
            <Link 
              to="/clans" 
              className={`${isActive('/clans') ? 'text-white' : 'text-gray-400'} hover:text-white transition font-medium`}
            >
              КЛАНЫ
            </Link>
            <Link 
              to="/help" 
              className={`${isActive('/help') ? 'text-white' : 'text-gray-400'} hover:text-white transition font-medium`}
            >
              ПОМОЩЬ
            </Link>
          </div>
        </div>

        {/* Правая часть: Авторизация или Профиль пользователя */}
        <div className="flex items-center gap-4">
          {user ? (
            // ✅ Авторизован: показываем инфо о пользователе
            <>
              <div className="flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-md">
                {/* Аватарка с первой буквой */}
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <span className="text-white font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Инфо */}
                <div>
                  <p className="text-blue-400 font-semibold text-sm tracking-wider">
                    {user.username}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
              
              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="px-7 py-1 border border-red-500 text-red-400 text-sm uppercase tracking-wider rounded-md hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-300 font-medium shadow-lg shadow-red-500/20"
              >
                Выйти
              </button>
            </>
          ) : (
            // ❌ Не авторизован: показываем кнопки входа и регистрации
            <>
              <Link 
                to="/login" 
                className="px-7 py-1 border border-gray-600 text-white text-sm uppercase tracking-wider rounded-md hover:border-blue-500 hover:scale-105 hover:bg-blue-500/10 transition-all duration-300 font-medium"
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className="px-7 py-1 bg-blue-600 text-white text-sm uppercase tracking-wider rounded-md hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-600/30 transition-all duration-300 font-medium"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;