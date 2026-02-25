import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { leaderboardAPI } from '../api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.get(50);
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Ошибка загрузки топа:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 Медали для топ-3
  const getMedal = (rank) => {
    switch (rank) {
      case 1:
        return { emoji: '🥇', color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' };
      case 2:
        return { emoji: '🥈', color: 'from-gray-300 to-gray-500', bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' };
      case 3:
        return { emoji: '🥉', color: 'from-amber-600 to-amber-800', bg: 'bg-amber-700/20', border: 'border-amber-700/50', text: 'text-amber-600' };
      default:
        return { emoji: `#${rank}`, color: 'from-gray-600 to-gray-800', bg: 'bg-gray-700/20', border: 'border-gray-600/30', text: 'text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const restPlayers = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a] to-[#0a0a0a] text-[#e0e0e0]">
      <Navigation />
      
      {/* 🔷 ЗАГОЛОВОК */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-[#333] py-12">
        <div className="container-cs px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-wider">
            🏆 ТОП ИГРОКОВ
          </h1>
          <p className="text-gray-400 text-lg">Лучшие игроки платформы Clash Royale</p>
        </div>
      </div>

      <div className="container-cs py-12 px-4">
        
        {/* 🔷 ПОДИУМ ТОП-3 */}
        {top3.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              
              {/* 2 место */}
              {top3[1] && (
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-b from-gray-700/40 to-gray-900/40 border-2 border-gray-400/50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-500/20">
                    <div className="text-6xl mb-3">🥈</div>
                    <div className="text-gray-300 text-sm uppercase tracking-wider mb-2">2 место</div>
                    <div className="text-2xl font-bold text-white mb-2">{top3[1].username}</div>
                    <div className="text-3xl font-bold text-gray-300">{top3[1].trophies}</div>
                    <div className="text-gray-500 text-sm">трофеев</div>
                    {top3[1].clan_tag && (
                      <div className="mt-3 text-blue-400 font-mono text-sm">{top3[1].clan_tag}</div>
                    )}
                  </div>
                </div>
              )}

              {/* 1 место */}
              {top3[0] && (
                <div className="order-1 md:order-2">
                  <div className="bg-gradient-to-b from-yellow-600/40 to-yellow-900/40 border-2 border-yellow-500/50 rounded-xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/30 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      ЧЕМПИОН
                    </div>
                    <div className="text-7xl mb-3 mt-2">👑</div>
                    <div className="text-yellow-400 text-sm uppercase tracking-wider mb-2">1 место</div>
                    <div className="text-3xl font-bold text-white mb-2">{top3[0].username}</div>
                    <div className="text-5xl font-bold text-yellow-400 mb-2">{top3[0].trophies}</div>
                    <div className="text-gray-500 text-sm">трофеев</div>
                    {top3[0].clan_tag && (
                      <div className="mt-3 text-yellow-400 font-mono">{top3[0].clan_tag}</div>
                    )}
                  </div>
                </div>
              )}

              {/* 3 место */}
              {top3[2] && (
                <div className="order-3 md:order-3">
                  <div className="bg-gradient-to-b from-amber-700/40 to-amber-900/40 border-2 border-amber-700/50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl shadow-amber-700/20">
                    <div className="text-6xl mb-3">🥉</div>
                    <div className="text-amber-600 text-sm uppercase tracking-wider mb-2">3 место</div>
                    <div className="text-2xl font-bold text-white mb-2">{top3[2].username}</div>
                    <div className="text-3xl font-bold text-amber-600">{top3[2].trophies}</div>
                    <div className="text-gray-500 text-sm">трофеев</div>
                    {top3[2].clan_tag && (
                      <div className="mt-3 text-amber-600 font-mono text-sm">{top3[2].clan_tag}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔷 ОСТАЛЬНЫЕ ИГРОКИ */}
        <div className="bg-[#242424] border border-[#333] rounded-xl overflow-hidden">
          <div className="bg-[#1a1a1a] border-b border-[#333] px-6 py-4">
            <h2 className="text-xl font-bold text-white">📊 Полный рейтинг</h2>
          </div>
          
          <div className="divide-y divide-[#333]">
            {restPlayers.map((player, index) => {
              const rank = index + 4;
              const medal = getMedal(rank);
              
              return (
                <div 
                  key={player.rank}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#2a2a2a] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {/* Ранг */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${medal.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                      {medal.emoji}
                    </div>
                    
                    {/* Инфо игрока */}
                    <div>
                      <div className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {player.username}
                      </div>
                      {player.clan_tag && (
                        <div className="text-gray-500 text-sm font-mono">{player.clan_tag}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Трофеи */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{player.trophies}</div>
                    <div className="text-gray-500 text-sm">трофеев</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔷 СТАТИСТИКА */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-white mb-1">{leaderboard.length}</div>
            <div className="text-gray-400 text-sm">Игроков в топе</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">👑</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {top3[0]?.trophies || 0}
            </div>
            <div className="text-gray-400 text-sm">Лучший результат</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {Math.round(leaderboard.reduce((acc, p) => acc + p.trophies, 0) / (leaderboard.length || 1))}
            </div>
            <div className="text-gray-400 text-sm">Средний счёт</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;