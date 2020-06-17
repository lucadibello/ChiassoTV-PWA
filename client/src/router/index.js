import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import AdminPanel from '@/components/Admin'
import Login from '@/components/admin/Login'
import UserManagement from '@/components/admin/UserManagement'
import NotFound from '@/components/errors/404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Hello
    },
    {
      path: '/admin',
      component: AdminPanel,
      meta: {
        breadcrumb: 'Panello Admin'
      },
      children: [
        {
          path: '/',
          redirect: 'utenti'
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'utenti',
          name: 'Gestione utenti',
          component: UserManagement,
          meta: {
            breadcrumb: 'Gestione utenti'
          }
        }
      ]
    },
    {
      path: '*',
      name: '404 Not Found',
      component: NotFound
    }
  ]
})
