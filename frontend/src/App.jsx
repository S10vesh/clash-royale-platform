import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Импорт страниц
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Rules from './pages/Rules'
import Tournaments from './pages/Tournaments'
import Leaderboard from './pages/Leaderboard'
import Clans from './pages/Clans'
import Help from './pages/Help'

// 🔐 Защищённый роут
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
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
    // 🔧 Убрал bg-gray-900 — теперь фон из index.css будет виден
    <div className="min-h-screen w-screen overflow-auto">
      <Routes>
        {/* Публичные роуты */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/help" element={<Help />} />

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