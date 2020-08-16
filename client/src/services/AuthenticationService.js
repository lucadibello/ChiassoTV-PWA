import Api from '@/services/Api'

export default {
  login (credentials) {
    return Api().post('login', credentials)
  },
  setToken (token) {
    // Set JWT token to axios
    sessionStorage.setItem('token', token)
  },
  getToken () {
    return sessionStorage.getItem('token')
  },
  removeToken () {
    sessionStorage.removeItem('token')
  }
}
