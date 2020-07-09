import Vue from 'vue'
import VueRouter from 'vue-router'

// page components
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Homepage',
    title: 'ChiassoTV',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin-panel" */ '@/views/Admin'),
    meta: {
      breadcrumb: 'Panello Admin',
      admin: true
    },
    children: [
      {
        path: '/',
        redirect: 'utenti'
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "admin-panel" */ '../views/admin/Login'),
        meta: {
          title: 'ChiassoTV - Login',
          admin: false
        }
      },
      {
        path: 'utenti',
        name: 'Gestione utenti',
        component: () => import(/* webpackChunkName: "admin-panel" */ '../views/admin/UserManagement'),
        meta: {
          title: 'ChiassoTV - Gestione utenti',
          breadcrumb: 'Gestione utenti',
          admin: true
        }
      },
      {
        path: 'serie',
        name: 'Gestione serie',
        component: () => import(/* webpackChunkName: "admin-panel" */ '../views/admin/SeriesManagement'),
        meta: {
          title: 'ChiassoTV - Gestione serie',
          breadcrumb: 'Gestione serie',
          admin: true
        }
      },
      {
        path: 'serie/:name',
        name: 'Gestione episodi',
        component: () => import(/* webpackChunkName: "admin-panel" */ '../views/admin/EpisodesManagement'),
        props: true,
        meta: {
          title: 'ChiassoTV - Gestione episodi',
          breadcrumb: 'Gestione episodi',
          admin: true
        }
      }
    ]
  },
  {
    path: '*',
    name: '404 Not Found',
    component: () => import(/* webpackChunkName: "error-404" */ '../views/errors/404'),
    meta: {
      title: 'ChiassoTV - Pagina non trovata'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
