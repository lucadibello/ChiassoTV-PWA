import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthenticationService from '@/services/AuthenticationService'

// page components
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "public" */ '@/views/Base'),
    children: [
      {
        path: '/',
        name: 'Homepage',
        component: () => import(/* webpackChunkName: "public" */ '@/views/public/Home'),
        meta: {
          title: 'ChiassoTV - la web tv Ticinese',
          admin: false
        },
      },
      {
        path: '/contatti',
        name: 'Contatti',
        component: () => import(/* webpackChunkName: "public" */ '@/views/public/Contatti'),
        meta: {
          title: 'ChiassoTV - Contatti',
          admin: false
        },
      },
      {
        path: '/serie',
        name: 'Serie',
        component: () => import(/* webpackChunkName: "public" */ '@/views/public/Serie'),
        meta: {
          title: 'ChiassoTV - Serie',
          admin: false
        },
      },
      {
        path: '/serie/:name',
        name: 'Episodi',
        component: () => import(/* webpackChunkName: "public" */ '@/views/public/Episodi'),
        props: true,
        meta: {
          title: 'ChiassoTV - Episodi',
          admin: false
        },
      },
      {
        path: '/serie/:name/:episode',
        name: 'Player',
        component: () => import(/* webpackChunkName: "player" */ '@/views/public/Player'),
        props: true,
        meta: {
          title: 'ChiassoTV - WIP',
          admin: false
        },
      }
    ]
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
        component: () => import(/* webpackChunkName: "admin-panel-extra" */ '../views/admin/UserManagement'),
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
      },
      {
        path: 'home',
        name: 'Gestione homepage',
        component: () => import(/* webpackChunkName: "admin-panel" */ '../views/admin/HomepageManagement'),
        props: true,
        meta: {
          title: 'ChiassoTV - Gestione homepage',
          breadcrumb: 'Gestione homepage',
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

// Add protected-routes check
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title

  // Check for protected route
  if (to.meta.admin && !AuthenticationService.getToken()) {
    // No permission: redirect to login page
    next({
      path: '/admin/login'
    })
  } else {
    if (AuthenticationService.getToken() && to.name === 'Login') {
      // Redirect to admin panel: the user is already logged in
      next({
        path: '/admin'
      })
    } else {
      // Select normal route
      next()
    }
  }
})

export default router
