import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { clansAPI } from '../api';

function Clans() {
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  
  // Состояние модалки создания
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    description: ''
  });

  // Загрузка кланов при монтировании и при изменении поиска
  useEffect(() => {
    fetchClans();
  }, [search]);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const searchParam = search || null;
      const response = await clansAPI.getAll(searchParam, null);
      setClans(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Ошибка загрузки кланов:', err);
      setClans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tag') {
      // 🔧 Автоматически добавляем # и переводим в верхний регистр
      let processedValue = value.toUpperCase();
      if (!processedValue.startsWith('#')) {
        processedValue = '#' + processedValue;
      }
      // Оставляем только допустимые символы (#, буквы, цифры)
      processedValue = processedValue.replace(/[^#A-Z0-9]/g, '');
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setFormError('');
  };

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.detail;
    if (!detail) return 'Ошибка создания клана';
    if (Array.isArray(detail)) return detail[0]?.msg || 'Ошибка валидации данных';
    if (typeof detail === 'string') return detail;
    if (typeof detail === 'object') return detail.msg || JSON.stringify(detail);
    return 'Ошибка создания клана';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (formData.name.length < 3) {
      setFormError('Название клана должно содержать минимум 3 символа');
      setSubmitting(false);
      return;
    }
    
    if (!formData.tag.match(/^#[A-Z0-9]{3,10}$/)) {
      setFormError('Тег должен начинаться с # и содержать 3-10 символов (буквы и цифры)');
      setSubmitting(false);
      return;
    }

    try {
      await clansAPI.create({
        name: formData.name,
        tag: formData.tag.toUpperCase(),
        description: formData.description
      });
      
      setIsModalOpen(false);
      setFormData({ name: '', tag: '', description: '' });
      fetchClans();
      
    } catch (err) {
      console.error('Ошибка создания клана:', err);
      const errorMsg = getErrorMessage(err);
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinClan = async (clanId) => {
    try {
      await clansAPI.join(clanId);
      alert('✅ Вы успешно присоединились к клану!');
      fetchClans();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при вступлении в клан';
      alert('❌ ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  // Фильтрация на клиенте (дополнительно к серверному поиску)
  const filteredClans = clans.filter(clan => {
    const matchesSearch = clan.name?.toLowerCase().includes(search.toLowerCase()) ||
                         clan.tag?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'all' || 
                      (selectedTag === 'Топ 10' && clan.trophies >= 1000) ||
                      (selectedTag === 'Топ 25' && clan.trophies >= 500) ||
                      (selectedTag === 'Топ 50' && clan.trophies >= 100) ||
                      (selectedTag === 'Топ 100' && clan.trophies >= 10);
    return matchesSearch && matchesTag;
  });

  const openModal = () => {
    setIsModalOpen(true);
    setFormError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', tag: '', description: '' });
    setFormError('');
  };

  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      <div className="h-4"></div>
      <div className="flex-1 container-cs py-8">
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Кланы</h1>
          <button 
            onClick={openModal}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-5 py-2 text-sm uppercase tracking-wider transition hover:scale-105"
          >
            + Создать клан
          </button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Поиск клана или тега..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
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

        {/* Загрузка */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Загрузка...</div>
        ) : filteredClans.length > 0 ? (
          /* 🔷 СПИСОК КЛАНОВ */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClans.map((clan) => (
              <div
                key={clan.id}
                className="bg-black/40 border border-[#333] rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group"
              >
                {/* Шапка клана */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {clan.name}
                    </h3>
                    <div className="text-blue-400 font-mono text-sm mt-1">
                      {clan.tag}
                    </div>
                  </div>
                  <div className="text-3xl">🏰</div>
                </div>

                {/* Описание */}
                {clan.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {clan.description}
                  </p>
                )}

                {/* Статистика */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>👥</span>
                    <span>{clan.members_count} / 50</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <span>🏆</span>
                    <span>{clan.trophies}</span>
                  </div>
                </div>

                {/* Прогресс бар участников */}
                <div className="mb-4">
                  <div className="bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
                      style={{ width: `${Math.min((clan.members_count / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Кнопка вступления */}
                <button
                  onClick={() => handleJoinClan(clan.id)}
                  className="w-full py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/50 rounded transition text-sm uppercase tracking-wider"
                >
                  Вступить в клан
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Пустое состояние */
          <div className="border-2 border-dashed border-[#444] p-16 text-center rounded-lg">
            <div className="text-gray-500 text-7xl mb-4">🏰</div>
            <div className="text-gray-400 text-2xl uppercase tracking-wider mb-2">
              {search ? 'Кланы не найдены' : 'Здесь пока нет кланов'}
            </div>
            <p className="text-gray-500 text-sm mb-6">
              {search ? 'Попробуйте изменить запрос поиска' : 'Создай первый клан и пригласи друзей!'}
            </p>
            {!search && (
              <button 
                onClick={openModal}
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-8 py-3 text-sm uppercase tracking-wider transition hover:scale-105"
              >
                ✨ Создать клан
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🔷 МОДАЛКА СОЗДАНИЯ КЛАНА */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-md">
            
            <div className="flex justify-between items-center p-5 border-b border-[#333]">
              <h3 className="text-xl font-bold uppercase tracking-wider">Создать клан</h3>
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
                <label className="block text-sm text-gray-500 mb-1 uppercase">Название *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="Могучие Воины"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1 uppercase">Тег *</label>
                <input 
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (!formData.tag) {
                      setFormData(prev => ({ ...prev, tag: '#' }));
                    }
                  }}
                  required
                  maxLength={11}
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition uppercase font-mono"
                  placeholder="#CLAN"
                />
                <p className="text-xs text-gray-600 mt-1">Автоматически добавляется # и заглавные буквы</p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1 uppercase">Описание</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-black/40 border border-[#333] px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Опишите ваш клан..."
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

export default Clans;