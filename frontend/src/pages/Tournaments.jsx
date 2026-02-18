import { useState } from 'react';
import Navigation from '../components/Navigation';

function Tournaments() {
  const [selectedStatus, setSelectedStatus] = useState('future');
  const [selectedMode, setSelectedMode] = useState('all');

  // Моковые данные для турниров (потом заменится на реальные)
  const tournaments = [];

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      <div className="h-4"></div>
      <div className="flex-1 container-cs py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Турниры</h1>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-2 text-sm uppercase tracking-wider transition hover:scale-105">
            + Создать турнир
          </button>
        </div>

        {/* Фильтры */}
        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedStatus('future')}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition ${
                selectedStatus === 'future' 
                  ? 'bg-blue-600/20 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Будущие
            </button>
            <button 
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition ${
                selectedStatus === 'active' 
                  ? 'bg-blue-600/20 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Активные
            </button>
          </div>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="all">Все режимы</option>
            <option value="1v1">1vs1</option>
            <option value="2v2">2vs2</option>
          </select>
        </div>

        {/* Список турниров */}
        {tournaments.length > 0 ? (
          <div className="grid gap-4">
            {tournaments.map(t => (
              <div key={t.id} className="bg-black/40 border border-[#333] p-4">
                {/* Здесь будут турниры */}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#444] p-16 text-center">
            <div className="text-gray-500 text-7xl mb-4">🏆</div>
            <div className="text-gray-400 text-2xl uppercase tracking-wider mb-2">
              Здесь пока нет турниров
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Создай первый турнир и пригласи игроков!
            </p>
            {/* Нижняя кнопка УДАЛЕНА */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tournaments;