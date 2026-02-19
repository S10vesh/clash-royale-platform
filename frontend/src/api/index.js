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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== 🔐 Auth ====================

export const authAPI = {
  register: (data) => 
    api.post('/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    }),

  login: (username, password) => 
    api.post('/login', { username, password }),

  getMe: () => api.get('/users/me'),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ==================== 🏆 Tournaments ====================

export const tournamentsAPI = {
  getAll: (status = null, mode = null) => {
    const params = {}
    if (status && status !== 'all') params.status_filter = status
    if (mode && mode !== 'all') params.mode_filter = mode
    
    console.log('📡 Запрос турниров с параметрами:', params)
    
    return api.get('/tournaments', { params })
  },

  getById: (id) => api.get(`/tournaments/${id}`),

  create: (data) => api.post('/tournaments', data),

  // 🔧 НОВЫЕ: Участие в турнире
  join: (id) => api.post(`/tournaments/${id}/join`),
  leave: (id) => api.post(`/tournaments/${id}/leave`),
  getParticipants: (id) => api.get(`/tournaments/${id}/participants`),
}

// ==================== 👥 Clans ====================

export const clansAPI = {
  getAll: (search = null, tag = null) => {
    const params = {}
    if (search) params.search = search
    if (tag) params.tag = tag
    return api.get('/clans', { params })
  },

  getById: (id) => api.get(`/clans/${id}`),

  create: (data) => api.post('/clans', data),

  join: (id) => api.post(`/clans/${id}/join`),
}

// ==================== 📊 Leaderboard ====================

export const leaderboardAPI = {
  get: (limit = 10) => api.get('/leaderboard', { params: { limit } }),
}

export default api