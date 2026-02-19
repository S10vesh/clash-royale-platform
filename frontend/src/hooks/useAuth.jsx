import { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const API_URL = 'http://localhost:8000/api'

// ✅ Создаём инстанс axios с JSON заголовком по умолчанию
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // 🔐 LOGIN — отправляем как form data (OAuth2 требует x-www-form-urlencoded)
  const login = async (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    const { access_token, user } = response.data
    
    if (!access_token || !user) {
      throw new Error('Неверный формат ответа от сервера')
    }
    
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return response.data
  }

  // 📝 REGISTER — отправляем как JSON (бэкенд ожидает JSON)
  const register = async (data) => {
    const response = await api.post('/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    })
    
    const { access_token, user } = response.data
    
    if (!access_token || !user) {
      throw new Error('Неверный формат ответа от сервера')
    }
    
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return response.data
  }

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = { user, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}