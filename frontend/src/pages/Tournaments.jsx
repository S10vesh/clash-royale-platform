import { useState } from 'react';
import Navigation from '../components/Navigation';

function Clans() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Пока нет кланов — пустой массив
  const clans = [];

  const filteredClans = clans.filter(clan => {
    const matchesSearch = clan.name?.toLowerCase().includes(search.toLowerCase()) ||
                         clan.tag?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'all' || clan.rank === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      
      <div className="flex-1 container-cs py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Кланы</h1>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-2 text-sm uppercase tracking-wider transition hover:scale-105">
            + Создать клан
          </button>
        </div>

        {/* Поиск и фильтры — оставляем, пригодятся */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск клана или тега..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="all">Все кланы</option>
            <option value="Топ 10">Топ 10</option>
            <option value="Топ 25">Топ 25</option>
            <option value="Топ 50">Топ 50</option>
            <option value="Топ 100">Топ 100</option>
          </select>
        </div>

        {/* Пустое состояние — кланов пока нет */}
        <div className="border-2 border-dashed border-[#444] p-16 text-center">
          <div className="text-gray-500 text-7xl mb-4">🏰</div>
          <div className="text-gray-400 text-2xl uppercase tracking-wider mb-2">
            Здесь пока нет кланов
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Создай первый клан и пригласи друзей!
          </p>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-8 py-3 text-sm uppercase tracking-wider transition hover:scale-105">
            ✨ Создать клан
          </button>
        </div>
      </div>
    </div>
  );
}

export default Clans;