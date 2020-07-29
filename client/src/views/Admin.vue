<template>
  <div id="admin">
    <b-navbar class="mb-3" toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <router-link
        to="/"
        v-slot="{ href, navigate}">
        <b-navbar-brand  :href="href" @click="navigate">ChiassoTV</b-navbar-brand >
      </router-link>
      
      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <router-link to="/admin/utenti" tag="b-nav-item">Gestione utenti</router-link>
          <router-link to="/admin/serie" tag="b-nav-item">Gestione serie</router-link>
          <router-link to="/admin/banner" tag="b-nav-item">Gestione banner</router-link>
          <router-link to="/admin/home" tag="b-nav-item">Gestione homepage</router-link>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-item class="font-weight-bold" v-on:click="logout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main>
      <!-- Admin pages will load inside router-view element -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// Import Authentication service
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'Admin',
  metaInfo: {
    meta: [
        { property: 'og:locale', content: "it_CH"},
        { property: 'og:locale:alternate', content: "it_IT"},
        { property: 'og:site_name', content: 'ChiassoTV'},
        { property: 'og:type', content: 'website'},    
        { name: 'robots', content: 'noindex'} 
    ],
    htmlAttrs: {
      lang: 'it',
    }
  },
  methods: {
    logout: function () {
      // Delete token
      AuthenticationService.removeToken()

      // Redirect to login page
      this.$router.push('/admin/login')
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

</style>