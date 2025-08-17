import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile')
}

export const memberAPI = {
  getMembers: (params) => api.get('/members', { params }),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (memberData) => api.post('/members', memberData),
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  deleteMember: (id) => api.delete(`/members/${id}`),
  sendReminder: (id) => api.post(`/members/${id}/reminder`),
  getMemberStats: () => api.get('/api/members/stats'),
  getExpiringMembers: () => api.get('/members/expiring')
}

export default api
