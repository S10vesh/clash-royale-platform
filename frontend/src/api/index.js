import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

export const authAPI = {
  register: (data) => api.post('/register', { username: data.username, email: data.email, password: data.password, confirm_password: data.confirmPassword }),
  login: (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    return axios.post(`${API_URL}/login`, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  },
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); },
  axios: api,
}

export const tournamentsAPI = {
  getAll: (status = null, mode = null) => {
    const params = {}
    if (status) params.status_filter = status
    if (mode) params.mode_filter = mode
    return api.get('/tournaments', { params })
  },
  getById: (id) => api.get(`/tournaments/${id}`),
  create: (data) => api.post('/tournaments', data),
  join: (id) => api.post(`/tournaments/${id}/join`),
  leave: (id) => api.post(`/tournaments/${id}/leave`),
  getParticipants: (id) => api.get(`/tournaments/${id}/participants`),
}

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
  leave: (id) => api.post('/clans/leave'),
}

export const leaderboardAPI = {
  get: (limit = 10) => api.get('/leaderboard', { params: { limit } }),
}

export default api