import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AdminPanel from '@/components/Admin'
import Login from '@/components/admin/Login'
import UserManagement from '@/components/admin/UserManagement'
import NotFound from '@/components/errors/404'
import SeriesManagement from '@/components/admin/SeriesManagement'

// Services
import AuthenticationService from '@/services/AuthenticationService'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      title: 'ChiassoTV',
      component: Hello
    },
    {
      path: '/admin',
      component: AdminPanel,
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
          component: Login,
          meta: {
            title: 'ChiassoTV - Login',
            admin: false
          }
        },
        {
          path: 'utenti',
          name: 'Gestione utenti',
          component: UserManagement,
          meta: {
            title: 'ChiassoTV - Gestione utenti',
            breadcrumb: 'Gestione utenti',
            admin: true
          }
        },
        {
          path: 'serie',
          name: 'Gestione serie',
          component: SeriesManagement,
          meta: {
            title: 'ChiassoTV - Gestione serie',
            breadcrumb: 'Gestione serie',
            admin: true
          }
        },
        {
          path: 'serie/:name',
          name: 'Gestione episodi',
          component: Login,
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
      component: NotFound,
      meta: {
        title: 'ChiassoTV - Pagina non trovata'
      }
    }
  ]
})

// Add protected-routes check
router.beforeEach((to, from, next) => {
  console.log(to.title)
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

// Export router with settings
export default router
