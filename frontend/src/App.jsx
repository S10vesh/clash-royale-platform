import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tournaments from './pages/Tournaments';
import Leaderboard from './pages/Leaderboard';
import Clans from './pages/Clans';
import Help from './pages/Help';
import Terms from './pages/Terms';  // ← ДОБАВИЛИ ИМПОРТ

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/clans" element={<Clans />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />  {/* ← ДОБАВИЛИ МАРШРУТ */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;