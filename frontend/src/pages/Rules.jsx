import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

function Rules() {
  const rules = [
    {
      title: '🚫 Использование сторонних ПО',
      desc: 'Запрещено использование стороннего ПО, ботов, эксплойтов и любых методов, дающих преимущество в турнирах или на платформе.',
      punishment: '⛔ Наказание: Перманентная блокировка аккаунта'
    },
    {
      title: '🔐 Злоупотребление функционалом платформы',
      desc: 'Ввод администрации/модерации при подведении итогов матча в заблуждение запрещен',
      punishment: '⛔ Наказание: Блокировка на 24 часа. При повторном нарушении наказание может быть продлено до 10 дней. Администратор отсавляет за собой право на перманентную блокировку '
    },
    {
      title: '🗣️ Оскорбление/нецензурная лексика ',
      desc: 'Уважайте других игроков. Оскорбления, токсичное поведение, дискриминация по любому признаку, спам и флуд запрещены в чатах и комментариях.',
      punishment: '⛔ Наказание: Блокировка на 24 часа. При повторном нарушении пользователь будет заблокирован на 7 дней'
    },
    {
      title: '👑 Оскорбление администрации',
      desc: 'Запрещены оскорбления, неуважительное отношение или угрозы в адрес администрации платформы.',
      punishment: '⛔ Наказание: Блокировка на 7 дней. При повторном нарушении пользователь будет заблокирован на 30 дней'
    },
    {
      title: '🎮 Честная игра',
      desc: 'Участвуйте в турнирах только с одним аккаунтом. Мультиаккаунтинг для обхода правил, накрутки или манипуляций карается перманентным баном.',
      punishment: '⛔ Наказание: Перманентная блокировка всех аккаунтов'
    },
    {
      title: '🔐 Безопасность аккаунта',
      desc: 'Не сообщайте логин или пароль. Администрация не несёт ответственности за утерю доступа из-за передачи данных.',
      punishment: '⚠️ Наказание: Блокировка при подозрении на взлом'
    },
    {
      title: '⚖️ Решения администрации',
      desc: 'Администрация оставляет за собой право блокировать пользователей за нарушение правил без предварительного уведомления.',
      punishment: '⚠️ Все нарушения фиксируются в системе'
    },
    {
      title: '🔄 Изменения правил',
      desc: 'Правила могут обновляться. Актуальная версия всегда доступна на этой странице. Продолжение использования платформы означает согласие с новыми правилами.',
      punishment: null
    }
  ];

  return (
    <div className="min-h-screen text-[#e0e0e0] bg-gray-900/80 pb-12">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 pt-16">
        
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider text-center">
          Правила платформы
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Пожалуйста, ознакомьтесь с правилами перед участием в турнирах
        </p>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div 
              key={index}
              className="bg-black/40 backdrop-blur-md border border-[#333] p-5 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                {rule.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                {rule.desc}
              </p>
              {rule.punishment && (
                <div className="border-t border-[#333] pt-3 mt-3">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                    {rule.punishment}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            to="/register" 
            className="inline-block bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#444] px-8 py-3 uppercase tracking-wider transition font-semibold text-sm"
          >
            Вернуться к регистрации
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Rules;