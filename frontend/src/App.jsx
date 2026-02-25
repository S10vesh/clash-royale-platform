import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Импорт страниц
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Rules from './pages/Rules'
import Tournaments from './pages/Tournaments'
import TournamentDetails from './pages/TournamentDetails'
import Leaderboard from './pages/Leaderboard'
import Clans from './pages/Clans'
import Help from './pages/Help'
import Profile from './pages/Profile'  // 🔧 Добавлен импорт Profile

// 🔐 Защищённый роут
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    // 🔧 Убрал bg-gray-900 — теперь фон из index.css виден
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto">
      <Routes>
        {/* Публичные роуты */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/help" element={<Help />} />

        {/* 🔧 Новый роут: Профиль */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Защищённые роуты */}
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <Tournaments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/:id"
          element={
            <ProtectedRoute>
              <TournamentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clans"
          element={
            <ProtectedRoute>
              <Clans />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App