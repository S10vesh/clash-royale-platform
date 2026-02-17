import Navigation from '../components/Navigation';

function Leaderboard() {
  return (
    <div className="min-h-screen text-[#e0e0e0] flex flex-col">
      <Navigation />
      
      <div className="flex-1 container-cs py-8">
        <h1 className="text-3xl font-bold mb-6 uppercase tracking-wider">Топ игроков</h1>
        
        <div className="bg-black/40 backdrop-blur-md border border-[#333] p-6">
          <div className="space-y-2">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="flex items-center gap-4 p-2 hover:bg-white/5 transition">
                <span className="text-gray-500 w-8 text-right">#{i}</span>
                <span className="text-white flex-1">Игрок_{i}</span>
                <span className="text-gray-500">{2000 - i*50}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;