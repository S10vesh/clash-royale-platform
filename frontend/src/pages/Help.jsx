import Navigation from '../components/Navigation';

function Help() {
  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      <div className="h-4"></div>
      <div className="flex-1 container-cs py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-wider">Помощь</h1>
        
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Как создать турнир?</h3>
              <p className="text-gray-400">Для создания турнира необходимо зарегистрироваться и нажать кнопку "Создать турнир" в левой колонке.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Как вступить в клан?</h3>
              <p className="text-gray-400">Перейдите в раздел "Кланы", найдите подходящий клан и отправьте заявку на вступление.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Правила платформы</h3>
              <p className="text-gray-400">Запрещены оскорбления, читы и мультиаккаунты.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;