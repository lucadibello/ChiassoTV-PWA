import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import AuthenticationService from '@/services/AuthenticationService'

// Import Vue router
Vue.use(VueRouter)
// Import vue meta data manager
Vue.use(VueMeta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})

const routes = [
  {
    path: '/',
    component: () => import('@/views/Base'),
    children: [
      {
        path: '/',
        name: 'Homepage',
        component: () => import('@/views/public/Home'),
        meta: {
          admin: false
        },
      },
      {
        path: '/contatti',
        name: 'Contatti',
        component: () => import('@/views/public/Contatti'),
        meta: {
          admin: false
        },
      },
      {
        path: '/serie',
        name: 'Serie',
        component: () => import('@/views/public/Serie'),
        meta: {
          admin: false
        },
      },
      {
        path: '/serie/:name',
        name: 'Episodi',
        component: () => import('@/views/public/Episodi'),
        props: true,
        meta: {
          admin: false
        },
      },
      {
        path: '/serie/:name/:episode',
        name: 'Player',
        component: () => import('@/views/public/Player'),
        props: true,
        meta: {
          admin: false
        },
      },
      {
        path: '/condizioni',
        name: 'TermsOfService',
        component: () => import('@/views/public/TOS'),
        meta: {
          admin: false
        },
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin'),
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
        component: () => import('../views/admin/Login'),
        meta: {
          admin: false
        }
      },
      {
        path: 'utenti',
        name: 'Gestione utenti',
        component: () => import('../views/admin/UserManagement'),
        meta: {
          breadcrumb: 'Gestione utenti',
          admin: true
        }
      },
      {
        path: 'serie',
        name: 'Gestione serie',
        component: () => import('../views/admin/SeriesManagement'),
        meta: {
          breadcrumb: 'Gestione serie',
          admin: true
        }
      },
      {
        path: 'serie/:name',
        name: 'Gestione episodi',
        component: () => import('../views/admin/EpisodesManagement'),
        props: true,
        meta: {
          breadcrumb: 'Gestione episodi',
          admin: true
        }
      },
      {
        path: 'home',
        name: 'Gestione homepage',
        component: () => import('../views/admin/HomepageManagement'),
        props: true,
        meta: {
          breadcrumb: 'Gestione homepage',
          admin: true
        }
      }
    ]
  },
  {
    path: '*',
    name: '404 Not Found',
    component: () => import('../views/errors/404'),
  },
  {
    path: '/404',
    name: '404 Not Found GLOBAL',
    component: () => import('../views/errors/404'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Add protected-routes check
router.beforeEach((to, from, next) => {
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
