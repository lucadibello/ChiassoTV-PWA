import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

// Import libraries 
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';
import VueYouTubeEmbed from 'vue-youtube-embed'

// Import boostrap4 css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css';

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Install VueSweeetAlert2
Vue.use(VueSweetalert2)
// Install Youtube IFrame API
Vue.use(VueYouTubeEmbed)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
