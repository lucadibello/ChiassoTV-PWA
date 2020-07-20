import Api from '@/services/Api'

export default {
  login (credentials) {
    return Api().post('login', credentials)
  },
  setToken (token) {
    // Set JWT token to axios
    localStorage.setItem('token', token)
  },
  getToken () {
    return localStorage.getItem('token')
  },
  removeToken () {
    localStorage.removeItem('token')
  }
}
