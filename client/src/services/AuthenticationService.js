import Api from '@/services/Api'
import axios from 'axios'

export default {
  login (credentials) {
    return Api().post('login', credentials)
  },
  setToken (token) {
    // Set JWT token to axios
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  getToken () {
    return localStorage.getItem('token')
  },
  removeToken () {
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = ''
  }
}
