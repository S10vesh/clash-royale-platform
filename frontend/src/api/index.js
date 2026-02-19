import axios from 'axios'

// Базовый URL API
const API_URL = 'http://localhost:8000/api'

// Создаём axios инстанс
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Автоматически добавляем токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк - выходим
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== 🔐 Auth ====================

export const authAPI = {
  // Регистрация
  register: (data) => 
    api.post('/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    }),

  // Вход
  login: (username, password) => 
    api.post('/login', { username, password }),

  // Получить текущего пользователя
  getMe: () => api.get('/users/me'),

  // Выйти
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ==================== 🏆 Tournaments ====================

export const tournamentsAPI = {
  // Получить все турниры
  getAll: (status = null) => {
    const params = status ? { status } : {}
    return api.get('/tournaments', { params })
  },

  // Получить турнир по ID
  getById: (id) => api.get(`/tournaments/${id}`),

  // Создать турнир
  create: (data) => api.post('/tournaments', data),
}

// ==================== 👥 Clans ====================

export const clansAPI = {
  // Получить все кланы
  getAll: (search = null, tag = null) => {
    const params = {}
    if (search) params.search = search
    if (tag) params.tag = tag
    return api.get('/clans', { params })
  },

  // Получить клан по ID
  getById: (id) => api.get(`/clans/${id}`),

  // Создать клан
  create: (data) => api.post('/clans', data),

  // Вступить в клан
  join: (id) => api.post(`/clans/${id}/join`),
}

// ==================== 📊 Leaderboard ====================

export const leaderboardAPI = {
  // Получить таблицу лидеров
  get: (limit = 10) => api.get('/leaderboard', { params: { limit } }),
}

export default api