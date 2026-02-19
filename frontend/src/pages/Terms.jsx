import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="text-[#e0e0e0]">
      <Navigation />
      
      {/* Контейнер с отступами сверху и снизу */}
      <div className="container-cs py-12">
        <div className="flex justify-center">
          
          {/* Затемнённый квадрат — ОГРАНИЧЕН ПО ВЫСОТЕ */}
          <div className="bg-black/80 backdrop-blur-md border border-[#444] p-8 max-w-2xl w-full mx-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-white uppercase tracking-wider border-b border-[#444] pb-3">
              Правила платформы
            </h1>
            
            <div className="space-y-3">
              {/* Правило 1 */}
              <div className="flex items-start gap-3 p-3 bg-red-950/20 border-l-4 border-red-500">
                <span className="text-2xl">🚫</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Использование сторонних программ</h3>
                  <p className="text-gray-300 text-sm">Перманентная блокировка</p>
                </div>
              </div>

              {/* Правило 2 */}
              <div className="flex items-start gap-3 p-3 bg-yellow-950/20 border-l-4 border-yellow-500">
                <span className="text-2xl">🤬</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Оскорбления игроков</h3>
                  <p className="text-gray-300 text-sm">Блокировка 24 часа</p>
                </div>
              </div>

              {/* Правило 3 */}
              <div className="flex items-start gap-3 p-3 bg-orange-950/20 border-l-4 border-orange-500">
                <span className="text-2xl">👑</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Оскорбления администрации</h3>
                  <p className="text-gray-300 text-sm">Блокировка 7 дней</p>
                </div>
              </div>

              {/* Правило 4 */}
              <div className="flex items-start gap-3 p-3 bg-blue-950/20 border-l-4 border-blue-500">
                <span className="text-2xl">🎭</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Мультиаккаунты</h3>
                  <p className="text-gray-300 text-sm">Блокировка всех аккаунтов с последующей блокировкой</p>
                </div>
              </div>

              {/* Правило 5 */}
              <div className="flex items-start gap-3 p-3 bg-purple-950/20 border-l-4 border-purple-500">
                <span className="text-2xl">📢</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Реклама иных проектов и спам</h3>
                  <p className="text-gray-300 text-sm">Блокировка 5 часов</p>
                </div>
              </div>

              {/* Правило 6 */}
              <div className="flex items-start gap-3 p-3 bg-green-950/20 border-l-4 border-green-500">
                <span className="text-2xl">🔄</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Неспортивное поведение</h3>
                  <p className="text-gray-300 text-sm">Дисквалификация</p>
                </div>
              </div>
            </div>

            {/* Кнопка */}
            <div className="mt-6 text-center">
              <Link 
                to="/register" 
                className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                ← Назад
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;