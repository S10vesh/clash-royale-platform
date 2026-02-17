import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="border-b border-[#333] bg-black/40 backdrop-blur-md">
      <div className="container-cs flex items-center justify-between py-3">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-white tracking-wider">CLASH ROYALE</h1>

          {/* Меню по центру */}
          <div className="flex gap-8 text-sm uppercase tracking-wider mx-auto">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              ГЛАВНАЯ
            </Link>
            <Link 
              to="/tournaments" 
              className={`${isActive('/tournaments') ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              ТУРНИРЫ
            </Link>
            <Link 
              to="/leaderboard" 
              className={`${isActive('/leaderboard') ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              ТОПЫ
            </Link>
            <Link 
              to="/clans" 
              className={`${isActive('/clans') ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              КЛАНЫ
            </Link>
            <Link 
              to="/help" 
              className={`${isActive('/help') ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              ПОМОЩЬ
            </Link>
          </div>
        </div>

        {/* ДВЕ КНОПКИ СПРАВА — Войти и Регистрация */}
        <div className="flex gap-3">
          <Link 
            to="/login" 
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-1.5 text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105"
          >
            🔑 Войти
          </Link>
          <Link 
            to="/register" 
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-1.5 text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105"
          >
            📝 Регистрация
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navigation;