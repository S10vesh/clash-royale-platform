import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Логотип с иконкой */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">CR</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent font-['Orbitron']">
              Clash Royale
            </span>
          </Link>

          {/* Меню */}
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-secondary">
              Главная
            </Link>
            <Link to="/leaderboard" className="btn-secondary">
              Топ-100
            </Link>
            <Link to="/tournaments" className="btn-secondary">
              Турниры
            </Link>
            <Link to="/clans" className="btn-secondary">
              Кланы
            </Link>
            <Link to="/player/123" className="btn-secondary">
              Профиль
            </Link>
            <Link 
              to="/login" 
              className="btn-primary ml-2"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;