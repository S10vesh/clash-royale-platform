import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { tournamentsAPI } from '../api';

function Home() {
  const [selectedStatus, setSelectedStatus] = useState('future');
  const [selectedMode, setSelectedMode] = useState('all');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка турниров при монтировании
  useEffect(() => {
    fetchTournaments();
  }, [selectedStatus, selectedMode]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const statusParam = selectedStatus === 'all' ? null : selectedStatus;
      const modeParam = selectedMode === 'all' ? null : selectedMode;
      
      const response = await tournamentsAPI.getAll(statusParam, modeParam);
      setTournaments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Ошибка загрузки турниров:', err);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400';
      default: return 'bg-blue-600/20 text-blue-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Идёт';
      default: return 'Скоро';
    }
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col relative">
      
      <Navigation />

      {/* Пустой блок для отступа */}
      <div className="h-4"></div>

      {/* Основной контент */}
      <div className="flex-1 container-cs flex gap-6 py-6 text-base">
        
        {/* Левая колонка — фильтры */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-4">
            <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">Фильтры</h2>
            
            <div className="space-y-6">
              {/* Статус */}
              <div>
                <div className="text-base uppercase text-gray-500 mb-2">СТАТУС</div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedStatus('future')}
                    className={`w-full text-left text-base px-2 py-1 transition ${
                      selectedStatus === 'future' 
                        ? 'text-white bg-blue-600/20 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Будущие
                  </button>
                  <button 
                    onClick={() => setSelectedStatus('active')}
                    className={`w-full text-left text-base px-2 py-1 transition ${
                      selectedStatus === 'active' 
                        ? 'text-white bg-blue-600/20 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Активные
                  </button>
                </div>
              </div>
              
              {/* Режимы */}
              <div>
                <div className="text-base uppercase text-gray-500 mb-2">РЕЖИМЫ</div>
                <div className="space-y-1">
                  {['all', '1v1', '2v2'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`w-full text-left text-base px-2 py-1 transition ${
                        selectedMode === mode
                          ? 'text-white bg-blue-600/20 border-l-2 border-blue-500'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {mode === 'all' ? 'Все режимы' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Сброс */}
              <button 
                onClick={() => {
                  setSelectedStatus('future');
                  setSelectedMode('all');
                }}
                className="text-base text-gray-500 hover:text-white uppercase tracking-wider mt-4"
              >
                СБРОС
              </button>
            </div>
          </div>
        </div>

        {/* Центр — список турниров */}
        <div className="flex-1">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6">
            <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider">
              {selectedStatus === 'future' ? 'БУДУЩИЕ ТУРНИРЫ' : 'АКТИВНЫЕ ТУРНИРЫ'}
            </h2>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Загрузка...</div>
            ) : tournaments.length > 0 ? (
              <div className="space-y-3">
                {tournaments.map(t => (
                  <div 
                    key={t.id} 
                    className="bg-black/40 border border-[#333] p-4 rounded hover:border-[#555] transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Название — ссылка на страницу деталей */}
                        <Link 
                          to={`/tournaments/${t.id}`}
                          className="text-lg font-semibold text-white hover:text-blue-400 transition block mb-1"
                        >
                          {t.name}
                        </Link>
                        <p className="text-gray-400 text-sm">
                          📅 {new Date(t.date).toLocaleDateString('ru-RU')} в {new Date(t.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})} • 
                          🎮 {t.mode} • 
                          👥 {t.participants_count} / {t.max_players}
                        </p>
                        {t.prize > 0 && (
                          <p className="text-yellow-400 text-sm mt-1">💰 Приз: {t.prize} монет</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs uppercase rounded ${getStatusColor(t.status)}`}>
                        {getStatusText(t.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Убрана кнопка "Создать турнир" */
              <div className="border-2 border-dashed border-[#444] p-12 text-center">
                <div className="text-gray-500 text-6xl mb-4">⚔️</div>
                <div className="text-gray-400 text-xl uppercase tracking-wider">
                  НЕТ ДОСТУПНЫХ ТУРНИРОВ
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Перейдите на страницу турниров, чтобы создать новый
                </p>
              </div>
            )}

            {/* Кнопка перехода на страницу турниров */}
            <div className="mt-6 text-center">
              <Link 
                to="/tournaments"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm uppercase tracking-wider transition"
              >
                Все турниры →
              </Link>
            </div>
          </div>
        </div>

        {/* Правая колонка — заглушка (будущий функционал) */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-4">
            <h3 className="text-base uppercase text-gray-500 mb-3">СКОРО БУДЕТ</h3>
            <div className="text-center text-gray-500 py-4 text-sm">
              <div className="text-4xl mb-2">🚀</div>
              <p>Новый функционал в разработке</p>
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="border-t border-[#333] bg-black/40 backdrop-blur-md py-4 mt-auto">
        <div className="container-cs flex justify-between text-sm text-gray-500">
          <div>© 2026 Clash Royale Platform</div>
          <div className="flex gap-4">
            <Link to="/rules" className="hover:text-gray-300">Правила</Link>
            <Link to="/help" className="hover:text-gray-300">Помощь</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;