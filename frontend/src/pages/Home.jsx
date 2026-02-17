import { useState } from 'react';
import Navigation from '../components/Navigation';

function Home() {
  const [selectedStatus, setSelectedStatus] = useState('future');
  const [selectedMode, setSelectedMode] = useState('all');

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col relative">
      
      <Navigation />

      {/* Основной контент — 3 колонки */}
      <div className="flex-1 container-cs flex gap-6 py-6">
        
        {/* Левая колонка — фильтры */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-4">
            <h2 className="text-lg font-bold mb-4 text-white uppercase tracking-wider">СОЗДАТЬ ТУРНИР</h2>
            
            <div className="space-y-6">
              {/* Статус */}
              <div>
                <div className="text-sm uppercase text-gray-500 mb-2">Статус</div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedStatus('future')}
                    className={`w-full text-left text-sm px-2 py-1 transition ${
                      selectedStatus === 'future' 
                        ? 'text-white bg-blue-600/20 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Будущие
                  </button>
                  <button 
                    onClick={() => setSelectedStatus('active')}
                    className={`w-full text-left text-sm px-2 py-1 transition ${
                      selectedStatus === 'active' 
                        ? 'text-white bg-blue-600/20 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Активные
                  </button>
                </div>
              </div>
              
              {/* Фильтры */}
              <div>
                <div className="text-sm uppercase text-gray-500 mb-2">Режимы</div>
                <div className="space-y-1">
                  {['all', '1v1', '2v2'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`w-full text-left text-sm px-2 py-1 transition ${
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
                className="text-sm text-gray-500 hover:text-white uppercase tracking-wider mt-4"
              >
                Сброс
              </button>
            </div>
          </div>
        </div>

        {/* Центр — список турниров */}
        <div className="flex-1">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6">
            <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider">
              {selectedStatus === 'future' ? 'Будущие турниры' : 'Активные турниры'}
            </h2>

            {/* Заглушка под реальные данные */}
            <div className="border-2 border-dashed border-[#444] p-12 text-center">
              <div className="text-gray-500 text-6xl mb-4">⚔️</div>
              <div className="text-gray-400 text-lg uppercase tracking-wider">
                Нет доступных турниров
              </div>
              <button className="mt-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-6 py-2 text-sm uppercase tracking-wider">
                Создать турнир
              </button>
            </div>
          </div>
        </div>

        {/* Правая колонка — топ игроков (заглушка) */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-black/40 backdrop-blur-md border border-[#333] p-4">
            <h3 className="text-sm uppercase text-gray-500 mb-3">ТОП ИГРОКОВ</h3>
            <div className="text-center text-gray-500 py-4">
              Загрузка...
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="border-t border-[#333] bg-black/40 backdrop-blur-md py-4 mt-auto">
        <div className="container-cs flex justify-between text-xs text-gray-500">
          <div>© 2026 Clash Royale Platform</div>
          <div className="flex gap-4">
            <button className="hover:text-gray-300">Правила</button>
            <button className="hover:text-gray-300">Контакты</button>
            <button className="hover:text-gray-300">API</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;