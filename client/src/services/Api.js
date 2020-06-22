import axios from 'axios'

// Set JWT token
let token = localStorage.getItem('token')
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default () => {
  return axios.create({
    baseURL: 'http://localhost:5000/api'
  })
}
