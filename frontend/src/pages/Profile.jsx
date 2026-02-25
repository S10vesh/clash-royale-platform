import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { authAPI, tournamentsAPI } from '../api';

// Флаги стран
const COUNTRIES = [
  { code: 'RU', name: 'Россия', flag: '🇷🇺' },
  { code: 'US', name: 'США', flag: '🇺🇸' },
  { code: 'DE', name: 'Германия', flag: '🇩🇪' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧' },
  { code: 'CN', name: 'Китай', flag: '🇨🇳' },
  { code: 'BR', name: 'Бразилия', flag: '🇧🇷' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾' },
];

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [userRegion, setUserRegion] = useState(null);
  const [stats, setStats] = useState({
    tournamentsPlayed: 0,
    tournamentsWon: 0,
    winRate: 0,
    globalRank: null
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const userRes = await authAPI.getMe();
      setUser(userRes.data);
      
      const savedRegion = localStorage.getItem('userRegion');
      if (savedRegion) {
        setUserRegion(JSON.parse(savedRegion));
      }

      const tournamentsRes = await tournamentsAPI.getAll(null, null);
      const userTournaments = tournamentsRes.data.filter(t => t.is_joined);
      
      setStats({
        tournamentsPlayed: userTournaments.length,
        tournamentsWon: 0,
        winRate: 0,
        globalRank: userRes.data.id
      });
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleRegionSelect = (country) => {
    setUserRegion(country);
    localStorage.setItem('userRegion', JSON.stringify(country));
    setShowRegionModal(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0]">
      <Navigation />
      
      {/* 🔷 HEADER ПРОФИЛЯ */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-[#333] pt-16 pb-8">
        <div className="container-cs px-4">
          <div className="flex gap-6 items-center">
            
            {/* 🔧 АВАТАР - БЕЗ РАМКИ */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-blue-600 shadow-xl flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
            </div>

            {/* Инфо */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-1">{user.username}</h1>
              <div className="flex gap-3 mt-3">
                <button 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                >
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 НАВИГАЦИЯ */}
      <div className="bg-[#242424] border-b border-[#333]">
        <div className="container-cs px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Обзор', icon: '👤' },
              { id: 'stats', label: 'Статистика', icon: '📊' },
              { id: 'tournaments', label: 'Турниры', icon: '🏆' },
              { id: 'settings', label: 'Настройки', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-blue-500 bg-[#1a1a1a]/50'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-[#1a1a1a]/30'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔷 ОСНОВНОЙ КОНТЕНТ */}
      <div className="container-cs py-12 px-4">
        <div className="grid grid-cols-12 gap-6">
          
          {/* ЛЕВАЯ КОЛОНКА - ТОЛЬКО В ОБЗОРЕ */}
          {activeTab === 'overview' && (
            <div className="col-span-12 lg:col-span-4 space-y-4">
              
              {/* Глобальный рейтинг */}
              <div className="bg-[#242424] border border-[#333] rounded-lg p-4">
                <h3 className="text-xs uppercase text-gray-500 mb-3 font-semibold">Глобальный рейтинг</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">#{stats.globalRank || 'N/A'}</div>
                    <div className="text-xs text-gray-500">из 1000+ игроков</div>
                  </div>
                  <div className="text-4xl">🏆</div>
                </div>
              </div>

              {/* 🔧 РЕГИОН */}
              <div className="bg-[#242424] border border-[#333] rounded-lg p-4">
                <h3 className="text-xs uppercase text-gray-500 mb-3 font-semibold">Регион</h3>
                <button 
                  onClick={() => setShowRegionModal(true)}
                  className="w-full flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 hover:border-blue-500/50 transition"
                >
                  {userRegion ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{userRegion.flag}</span>
                      <span className="text-white text-sm font-semibold">{userRegion.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Выберите регион</span>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Дата регистрации */}
              <div className="bg-[#242424] border border-[#333] rounded-lg p-4">
                <h3 className="text-xs uppercase text-gray-500 mb-3 font-semibold">Дата регистрации</h3>
                <div className="text-white font-semibold">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          )}

          {/* ПРАВАЯ КОЛОНКА */}
          <div className={activeTab === 'overview' ? 'col-span-12 lg:col-span-8' : 'col-span-12'}>
            
            {/* 🔷 ВКЛАДКА "ОБЗОР" */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Основная информация */}
                <div className="bg-[#242424] border border-[#333] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Основная информация</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] border border-[#333] rounded p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">Никнейм</div>
                      <div className="text-white font-semibold text-lg">{user.username}</div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">Clash Tag</div>
                      <div className="text-blue-400 font-mono text-lg">
                        {user.clash_tag || 'Не указан'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔧 ДОСТИЖЕНИЯ (только 2) */}
                <div className="bg-[#242424] border border-[#333] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Достижения</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`bg-[#1a1a1a] border rounded p-4 text-center transition ${
                        stats.tournamentsPlayed >= 1 
                          ? 'border-blue-500/50 opacity-100' 
                          : 'border-[#333] opacity-40'
                      }`}
                    >
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="text-white text-sm font-semibold mb-1">Первый турнир</div>
                      <div className="text-gray-500 text-xs">Участвовал в 1 турнире</div>
                    </div>
                    <div 
                      className={`bg-[#1a1a1a] border rounded p-4 text-center transition ${
                        stats.tournamentsWon >= 1 
                          ? 'border-yellow-500/50 opacity-100' 
                          : 'border-[#333] opacity-40'
                      }`}
                    >
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="text-white text-sm font-semibold mb-1">Победитель</div>
                      <div className="text-gray-500 text-xs">Выиграл турнир</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🔷 ВКЛАДКА "СТАТИСТИКА" */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div className="bg-[#242424] border border-[#333] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Статистика турниров</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{stats.tournamentsPlayed}</div>
                      <div className="text-gray-400 text-sm uppercase">Турниров сыграно</div>
                    </div>
                    <div className="text-center p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
                      <div className="text-4xl font-bold text-green-400 mb-2">{stats.tournamentsWon}</div>
                      <div className="text-gray-400 text-sm uppercase">Побед</div>
                    </div>
                    <div className="text-center p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.winRate}%</div>
                      <div className="text-gray-400 text-sm uppercase">Винрейт</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🔷 ВКЛАДКА "ТУРНИРЫ" */}
            {activeTab === 'tournaments' && (
              <div className="bg-[#242424] border border-[#333] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">История турниров</h3>
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🏆</div>
                  <p>Здесь будет история ваших турниров</p>
                </div>
              </div>
            )}

            {/* 🔷 ВКЛАДКА "НАСТРОЙКИ" */}
            {activeTab === 'settings' && (
              <div className="bg-[#242424] border border-[#333] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Настройки профиля</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Clash Tag</label>
                    <input 
                      type="text" 
                      placeholder="#ABC123"
                      defaultValue={user.clash_tag || ''}
                      className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-2 text-white rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                    Сохранить изменения
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔷 МОДАЛКА ВЫБОРА РЕГИОНА */}
      {showRegionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-md max-h-[500px] overflow-y-auto">
            
            <div className="flex justify-between items-center p-5 border-b border-[#333] sticky top-0 bg-[#1a1a1a] z-10">
              <h3 className="text-xl font-bold text-white">Выберите регион</h3>
              <button 
                onClick={() => setShowRegionModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleRegionSelect(country)}
                  className={`w-full flex items-center gap-3 p-3 rounded transition ${
                    userRegion?.code === country.code
                      ? 'bg-blue-600/20 border border-blue-500'
                      : 'bg-[#242424] border border-[#333] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-white font-semibold">{country.name}</span>
                  {userRegion?.code === country.code && (
                    <svg className="w-5 h-5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;