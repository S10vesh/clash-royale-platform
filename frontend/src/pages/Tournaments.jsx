import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // 🔧 Добавлен импорт Link
import Navigation from '../components/Navigation';
import { tournamentsAPI } from '../api';

function Tournaments() {
  const [selectedStatus, setSelectedStatus] = useState('future');
  const [selectedMode, setSelectedMode] = useState('all');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние модалки создания
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // 🔧 Состояние модалки участников
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    prize: '',
    mode: '1v1',
    max_players: 16
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_players' || name === 'prize' ? parseInt(value) || 0 : value
    }));
    setFormError('');
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (formData.name.length < 3) {
      setFormError('Название турнира должно содержать минимум 3 символа');
      setSubmitting(false);
      return;
    }
    if (!formData.date) {
      setFormError('Укажите дату проведения турнира');
      setSubmitting(false);
      return;
    }
    
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate <= now) {
      setFormError('Нельзя создать турнир с датой в прошлом');
      setSubmitting(false);
      return;
    }
    
    if (formData.prize < 0) {
      setFormError('Призовой фонд не может быть отрицательным');
      setSubmitting(false);
      return;
    }
    if (formData.max_players < 2) {
      setFormError('Минимум 2 игрока для турнира');
      setSubmitting(false);
      return;
    }

    try {
      await tournamentsAPI.create({
        name: formData.name,
        date: new Date(formData.date).toISOString(),
        prize: formData.prize,
        mode: formData.mode,
        max_players: formData.max_players
      });
      
      setIsModalOpen(false);
      setFormData({ name: '', date: '', prize: '', mode: '1v1', max_players: 16 });
      
      setTimeout(() => {
        fetchTournaments();
      }, 300);
      
    } catch (err) {
      console.error('Ошибка создания турнира:', err);
      const msg = err.response?.data?.detail || 'Ошибка создания турнира';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (tournamentId) => {
    try {
      await tournamentsAPI.join(tournamentId);
      alert('✅ Вы успешно присоединились к турниру!');
      fetchTournaments();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при вступлении в турнир';
      alert('❌ ' + msg);
    }
  };

  const handleLeave = async (tournamentId) => {
    if (!confirm('Вы уверены, что хотите выйти из турнира?')) return;
    
    try {
      await tournamentsAPI.leave(tournamentId);
      alert('✅ Вы вышли из турнира');
      fetchTournaments();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при выходе из турнира';
      alert('❌ ' + msg);
    }
  };

  // 🔧 Функция открытия модалки участников
  const openParticipantsModal = async (tournament) => {
    setSelectedTournament(tournament);
    setIsParticipantsModalOpen(true);
    setLoadingParticipants(true);
    
    try {
      const response = await tournamentsAPI.getParticipants(tournament.id);
      setParticipants(response.data);
    } catch (err) {
      console.error('Ошибка загрузки участников:', err);
      alert('❌ Не удалось загрузить список участников');
    } finally {
      setLoadingParticipants(false);
    }
  };

  const closeParticipantsModal = () => {
    setIsParticipantsModalOpen(false);
    setSelectedTournament(null);
    setParticipants([]);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setFormError('');
    setFormData(prev => ({ ...prev, date: getMinDateTime() }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', date: '', prize: '', mode: '1v1', max_players: 16 });
    setFormError('');
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      <div className="h-4"></div>
      <div className="flex-1 container-cs py-8 px-4">
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Турниры</h1>
          <button 
            onClick={openModal}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-2 text-sm uppercase tracking-wider transition hover:scale-105"
          >
            + Создать турнир
          </button>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
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
                  ? 'bg-green-600/20 text-white border-b-2 border-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Активные
            </button>
            <button 
              onClick={() => setSelectedStatus('past')}
              className={`px-4 py-2 text-sm uppercase tracking-wider transition ${
                selectedStatus === 'past' 
                  ? 'bg-gray-600/20 text-white border-b-2 border-gray-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Завершённые
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

        {loading ? (
          <div className="text-center py-16 text-gray-500">Загрузка...</div>
        ) : tournaments.length > 0 ? (
          <div className="grid gap-4">
            {tournaments.map(t => (
              <div key={t.id} className="bg-black/40 border border-[#333] p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* 🔧 Название турнира теперь ссылка на детали */}
                    <Link 
                      to={`/tournaments/${t.id}`}
                      className="text-lg font-semibold text-white hover:text-blue-400 transition block mb-1"
                    >
                      {t.name}
                    </Link>
                    <p className="text-gray-400 text-sm">
                      📅 {new Date(t.date).toLocaleDateString('ru-RU')} в {new Date(t.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})} • 
                      🎮 {t.mode} • 
                      👥 {t.max_players} игроков
                    </p>
                    {t.prize > 0 && (
                      <p className="text-yellow-400 text-sm mt-1">💰 Приз: {t.prize} монет</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      📊 Участников: {t.participants_count} / {t.max_players}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs uppercase rounded ${
                      t.status === 'active' ? 'bg-green-600/20 text-green-400' :
                      t.status === 'past' ? 'bg-gray-600/20 text-gray-400' :
                      'bg-blue-600/20 text-blue-400'
                    }`}>
                      {t.status === 'future' ? 'Скоро' : t.status === 'active' ? 'Идёт' : 'Завершён'}
                    </span>
                    {/* 🔧 Кнопка просмотра участников */}
                    <button
                      onClick={() => openParticipantsModal(t)}
                      className="px-4 py-2 text-xs uppercase bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 rounded transition"
                    >
                      👥 Участники ({t.participants_count})
                    </button>
                    {t.status !== 'past' && (
                      t.is_joined ? (
                        <button
                          onClick={() => handleLeave(t.id)}
                          className="px-4 py-2 text-xs uppercase bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 rounded transition"
                        >
                          Выйти
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(t.id)}
                          disabled={t.participants_count >= t.max_players}
                          className={`px-4 py-2 text-xs uppercase rounded transition ${
                            t.participants_count >= t.max_players
                              ? 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/50'
                          }`}
                        >
                          {t.participants_count >= t.max_players ? 'Нет мест' : 'Вступить'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#444] p-16 text-center rounded-lg">
            <div className="text-gray-500 text-7xl mb-4">🏆</div>
            <div className="text-gray-400 text-2xl uppercase tracking-wider mb-2">
              Здесь пока нет турниров
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Создай первый турнир и пригласи игроков!
            </p>
          </div>
        )}
      </div>

      {/* 🔷 МОДАЛКА УЧАСТНИКОВ */}
      {isParticipantsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-lg">
            
            <div className="flex justify-between items-center p-5 border-b border-[#333]">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider">Участники турнира</h3>
                {selectedTournament && (
                  <p className="text-gray-400 text-sm mt-1">{selectedTournament.name}</p>
                )}
              </div>
              <button 
                onClick={closeParticipantsModal}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              {loadingParticipants ? (
                <div className="text-center py-8 text-gray-500">Загрузка...</div>
              ) : participants.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {participants.map((p, index) => (
                    <div 
                      key={p.id} 
                      className="flex items-center justify-between bg-black/40 border border-[#333] p-3 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{p.username}</p>
                          {p.clash_tag && (
                            <p className="text-gray-500 text-xs">{p.clash_tag}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {new Date(p.joined_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Пока нет участников
                </div>
              )}
              
              {selectedTournament && (
                <div className="mt-4 pt-4 border-t border-[#333] text-sm text-gray-400">
                  Всего участников: <span className="text-white font-semibold">{participants.length}</span> из {selectedTournament.max_players}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#333]">
              <button 
                onClick={closeParticipantsModal}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] py-3 uppercase tracking-wider transition font-semibold"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔷 МОДАЛКА СОЗДАНИЯ ТУРНИРА */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-md">
            
            <div className="flex justify-between items-center p-5 border-b border-[#333]">
              <h3 className="text-xl font-bold uppercase tracking-wider">Создать турнир</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              {formError && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-500 mb-1 uppercase">Название</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="Летний чемпионат"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1 uppercase">Дата и время</label>
                <input 
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={getMinDateTime()}
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                />
                <p className="text-xs text-gray-600 mt-1">Минимум через 1 час от текущего времени</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1 uppercase">Режим</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="1v1">1vs1</option>
                    <option value="2v2">2vs2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1 uppercase">Макс. игроков</label>
                  <input 
                    type="number"
                    name="max_players"
                    value={formData.max_players}
                    onChange={handleChange}
                    required
                    min={2}
                    className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1 uppercase">Призовой фонд (монеты)</label>
                <input 
                  type="number"
                  name="prize"
                  value={formData.prize}
                  onChange={handleChange}
                  min={0}
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] py-3 uppercase tracking-wider transition font-semibold disabled:opacity-50"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 uppercase tracking-wider transition font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tournaments;