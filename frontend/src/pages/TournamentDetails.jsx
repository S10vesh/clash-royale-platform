import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { tournamentsAPI } from '../api';

function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      
      const tournamentRes = await tournamentsAPI.getById(id);
      setTournament(tournamentRes.data);
      
      const participantsRes = await tournamentsAPI.getParticipants(id);
      setParticipants(participantsRes.data);
    } catch (err) {
      console.error('Ошибка загрузки деталей турнира:', err);
      if (err.response?.status === 404) {
        alert('Турнир не найден');
        navigate('/tournaments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setActionLoading(true);
      await tournamentsAPI.join(id);
      alert('✅ Вы успешно присоединились к турниру!');
      // 🔧 Перезагружаем данные после вступления
      await fetchTournamentDetails();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при вступлении в турнир';
      alert('❌ ' + msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Вы уверены, что хотите выйти из турнира?')) return;
    
    try {
      setActionLoading(true);
      await tournamentsAPI.leave(id);
      alert('✅ Вы вышли из турнира');
      // 🔧 Перезагружаем данные после выхода
      await fetchTournamentDetails();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при выходе из турнира';
      alert('❌ ' + msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400 border-green-600/50';
      case 'past': return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
      default: return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '🔴 Идёт';
      case 'past': return '⚫ Завершён';
      default: return '🔵 Скоро';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[#e0e0e0]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen text-[#e0e0e0]">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-gray-500">Турнир не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#e0e0e0]">
      <Navigation />
      
      <div className="container-cs py-8 px-4">
        
        {/* Кнопка назад */}
        <div className="mb-6">
          <Link 
            to="/tournaments" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition"
          >
            ← Назад к турнирам
          </Link>
        </div>

        {/* Заголовок турнира */}
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                {tournament.name}
              </h1>
              <span className={`inline-block px-4 py-2 text-sm uppercase rounded border ${getStatusColor(tournament.status)}`}>
                {getStatusText(tournament.status)}
              </span>
            </div>
            
            {/* 🔧 Показываем правильную кнопку */}
            {tournament.status !== 'past' && (
              tournament.is_joined ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="px-6 py-3 text-sm uppercase bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 rounded transition disabled:opacity-50"
                >
                  {actionLoading ? '...' : 'Выйти'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading || tournament.participants_count >= tournament.max_players}
                  className={`px-6 py-3 text-sm uppercase rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    tournament.participants_count >= tournament.max_players
                      ? 'bg-gray-600/20 text-gray-500 border border-gray-600/50'
                      : 'bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/50'
                  }`}
                >
                  {actionLoading ? '...' : tournament.participants_count >= tournament.max_players ? 'Нет мест' : 'Вступить'}
                </button>
              )
            )}
          </div>

          {/* Информация о турнире */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-black/40 border border-[#333] p-4 rounded">
              <p className="text-gray-500 text-xs uppercase mb-1">📅 Дата и время</p>
              <p className="text-white font-semibold">
                {new Date(tournament.date).toLocaleDateString('ru-RU')}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(tournament.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            
            <div className="bg-black/40 border border-[#333] p-4 rounded">
              <p className="text-gray-500 text-xs uppercase mb-1">🎮 Режим</p>
              <p className="text-white font-semibold text-lg">{tournament.mode}</p>
            </div>
            
            <div className="bg-black/40 border border-[#333] p-4 rounded">
              <p className="text-gray-500 text-xs uppercase mb-1">👥 Участники</p>
              <p className="text-white font-semibold text-lg">
                {participants.length} / {tournament.max_players}
              </p>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(participants.length / tournament.max_players) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-black/40 border border-[#333] p-4 rounded">
              <p className="text-gray-500 text-xs uppercase mb-1">💰 Призовой фонд</p>
              <p className="text-yellow-400 font-semibold text-lg">
                {tournament.prize > 0 ? `${tournament.prize} монет` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Список участников */}
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
            👥 Участники турнира ({participants.length})
          </h2>
          
          {participants.length > 0 ? (
            <div className="space-y-2">
              {participants.map((p, index) => (
                <div 
                  key={p.id} 
                  className="flex items-center justify-between bg-black/40 border border-[#333] p-4 rounded hover:border-[#555] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{p.username}</p>
                      {p.clash_tag && (
                        <p className="text-gray-500 text-sm">🏷️ {p.clash_tag}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    <p>Присоединился</p>
                    <p className="text-gray-400">
                      {new Date(p.joined_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg uppercase tracking-wider mb-2">Пока нет участников</p>
              <p className="text-sm">Будьте первым!</p>
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4">
            ℹ️ Информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">ID турнира</p>
              <p className="text-white font-mono">#{tournament.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Создатель</p>
              <p className="text-white">Пользователь #{tournament.created_by}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TournamentDetails;