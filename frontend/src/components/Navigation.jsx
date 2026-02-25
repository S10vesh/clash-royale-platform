import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// 🔧 АВАТАРКИ С ЖИВОТНЫМИ (с цветами)
const AVATARS = {
  'default': { emoji: '👤', color: '#2563eb', gradient: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-500/50', shadow: 'shadow-blue-600/30' },
  'lion': { emoji: '🦁', color: '#eab308', gradient: 'from-yellow-500/20 to-amber-600/20', border: 'border-yellow-400/50', shadow: 'shadow-yellow-500/30' },
  'dog': { emoji: '🐶', color: '#b45309', gradient: 'from-amber-700/20 to-orange-800/20', border: 'border-amber-600/50', shadow: 'shadow-amber-700/30' },
  'cat': { emoji: '🐱', color: '#f97316', gradient: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-400/50', shadow: 'shadow-orange-500/30' },
  'panda': { emoji: '🐼', color: '#1f2937', gradient: 'from-gray-700/20 to-gray-800/20', border: 'border-gray-600/50', shadow: 'shadow-gray-700/30' },
  'koala': { emoji: '🐨', color: '#64748b', gradient: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-400/50', shadow: 'shadow-slate-500/30' },
  'tiger': { emoji: '🐯', color: '#ea580c', gradient: 'from-orange-600/20 to-red-700/20', border: 'border-orange-500/50', shadow: 'shadow-orange-600/30' },
};

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // 🔧 Получить текущую аватарку из localStorage или дефолт
  const getCurrentAvatar = () => {
    const savedAvatar = localStorage.getItem('userAvatar') || 'default';
    return AVATARS[savedAvatar] || AVATARS['default'];
  };

  const avatar = getCurrentAvatar();

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
              {/* 🔧 Профиль — с динамической обводкой и фоном в цвет аватарки */}
              <Link 
                to="/profile"
                className="flex items-center gap-3 px-5 py-2 rounded-md transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ 
                  backgroundColor: `${avatar.color}20`,
                  borderColor: avatar.color,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                {/* 🔧 Аватарка с животным */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: avatar.color }}
                >
                  <span className="text-white font-bold text-lg">
                    {avatar.emoji}
                  </span>
                </div>
                {/* Инфо — ник белый, почта серая как была */}
                <div>
                  <p className="text-white font-semibold text-sm tracking-wider">
                    {user.username}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {user.email}
                  </p>
                </div>
              </Link>
              
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