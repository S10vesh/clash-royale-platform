import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="border-b border-[#333] bg-black/40 backdrop-blur-md">
      <div className="container-cs flex items-center justify-between py-5">
        {/* Логотип и меню — ещё крупнее */}
        <div className="flex items-center gap-12">
          <h1 className="text-3xl font-bold text-white tracking-wider">CLASH ROYALE</h1>
          
          {/* Меню — крупнее и с большими отступами */}
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

        {/* КНОПКИ — чуть крупнее, но всё ещё аккуратные */}
        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </div>
  );
}

export default Navigation;