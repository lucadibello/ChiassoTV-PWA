import axios from 'axios'
import Vue from 'vue'

// Create base object
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL + 'api'
})

// Send token with all requests
axiosInstance.interceptors.request.use(
  config => {
      const token = sessionStorage.getItem('token');
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      // config.headers['Content-Type'] = 'application/json';
      return config;
  },
  error => {
      Promise.reject(error)
});

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
  // Return success responses
  return response;
}, function (error) {
  // Wrong token
  if (error.response.status == 403) {
    Vue.swal({
      title: "La sessione è scaduta.",
      text: "Per continuare devi eseguire nuovamente il login",
      showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Okay"
    }).then(() => { 
      // Remove token 
      sessionStorage.removeItem('token')
      // Redirect to login page
      window.location = '/admin/login'
    })
  } else if (error.response.status == 401) {
    // Authentication error
    Vue.swal({
      title: "Errore di autenticazione",
      text: "È stato riscontrato un problema durante l'autenticazione con il server. È necessario autenticarsi nuovamente",
      showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Okay"
    }).then(() => { 
      // Remove token 
      localStorage.removeItem('token')
      // Redirect to login page
      window.location = '/admin/login'
    })
  }

  // Return error promise
  return Promise.reject(error);
});

// Return axios with interceptors
export default () => {
  return axiosInstance
}
